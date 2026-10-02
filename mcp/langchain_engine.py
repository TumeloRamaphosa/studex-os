#!/usr/bin/env python3
"""StudEx Nexus LangChain MCP engine.

Shared tool bus for OpenClaw, Hermes, Herdr, and OpenRig.
Local models first. Secrets from disk only — never log values.
"""
from __future__ import annotations

import argparse
import json
import os
import socket
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

ROOT = Path(os.environ.get("STUDEX_OS_ROOT", Path.home() / "studex-os/nexus"))
WORK = Path(os.environ.get("STUDEX_WORK_ROOT", ROOT / "work"))
SEATS = ROOT / "seats.json"
BUSINESSES = ROOT / "businesses.json"
DRIVE_MAP = ROOT / "drive.json"
SECRETS = Path.home() / ".studex-os/secrets.env"
HOST = os.environ.get("STUDEX_ENGINE_HOST", "127.0.0.1")
ENGINE_PORT = int(os.environ.get("STUDEX_ENGINE_PORT", "8765"))
ORGO_DEFAULT_BASE = "https://www.orgo.ai/api"
DRIVE_DEFAULT_ID = "1Ap0rPgpnUli89561ZKgHxY59AIXQ5zgx"
DRIVE_DEFAULT_NAME = "Death Star"

GET_ALIASES = {
    "/": "health",
    "/health": "health",
    "/seats": "seats_list",
    "/models": "models_list",
    "/orgo": "orgo_status",
    "/agentmail": "agentmail_inboxes",
    "/deerflow": "deerflow_status",
    "/droiddesk": "droiddesk_status",
    "/openclaw": "openclaw_status",
    "/drive": "drive_status",
    "/buzz": "buzz_status",
    "/fleet": "fleet_status",
    "/status": "fleet_status",
    "/businesses": "businesses_list",
    "/hermes": "hermes_status",
    "/denchclaw": "denchclaw_status",
    "/grokbot": "grokbot_status",
}


def _ingest_env_file(path: Path, allow: set[str] | None = None) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[7:].strip()
        if "=" not in line:
            continue
        k, v = line.split("=", 1)
        key = k.strip()
        if allow and key not in allow:
            continue
        val = v.strip().strip('"').strip("'")
        if not val:
            continue
        os.environ.setdefault(key, val)


def _ingest_raw_key(path: Path, env_name: str) -> None:
    if not path.exists():
        return
    text = path.read_text().strip()
    if not text:
        return
    first = text.splitlines()[0].strip()
    if "=" in first:
        _ingest_env_file(path, allow={env_name})
        return
    os.environ.setdefault(env_name, first)


def load_secrets() -> None:
    SECRETS.parent.mkdir(parents=True, exist_ok=True)
    keys = Path.home() / ".openclaw" / "keys"
    _ingest_env_file(SECRETS)
    _ingest_raw_key(keys / "orgo_live.key", "ORGO_API_KEY")
    _ingest_env_file(keys / "agentmail.env", allow={"AGENTMAIL_API_KEY"})
    _ingest_env_file(Path.home() / ".config" / "agentmail" / "credentials.sh", allow={"AGENTMAIL_API_KEY"})
    _ingest_env_file(
        keys / "agent_keys.env",
        allow={"AGENTMAIL_API_KEY", "ORGO_API_KEY", "ORGO_BASE_URL", "ORGO_COMPUTER_ID"},
    )


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def secret_present(name: str) -> bool:
    return bool((os.environ.get(name) or "").strip())


def tcp_open(host: str, port: int, timeout: float = 0.4) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except OSError:
        return False


def read_json(path: Path, fallback: dict[str, Any]) -> dict[str, Any]:
    if not path.exists():
        return fallback
    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError:
        return fallback
    return data if isinstance(data, dict) else fallback


def read_seats() -> dict[str, Any]:
    return read_json(SEATS, {"system": "StudEx Nexus", "seats": {}})


def write_seats(data: dict[str, Any]) -> None:
    SEATS.parent.mkdir(parents=True, exist_ok=True)
    blob = json.dumps(data, indent=2) + "\n"
    SEATS.write_text(blob)
    dash = ROOT / "dashboard" / "seats.json"
    dash.parent.mkdir(parents=True, exist_ok=True)
    dash.write_text(blob)


def redact(obj: Any) -> Any:
    drop = {"vnc_password", "password", "secret", "token", "api_key", "authorization"}
    if isinstance(obj, dict):
        return {k: ("[redacted]" if k.lower() in drop or k.lower().endswith("_key") else redact(v)) for k, v in obj.items()}
    if isinstance(obj, list):
        return [redact(x) for x in obj]
    return obj


def http_json(method: str, url: str, headers: dict[str, str] | None = None, body: Any = None, timeout: int = 8) -> Any:
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Accept", "application/json")
    if body is not None:
        req.add_header("Content-Type", "application/json")
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8", "replace")
            parsed: Any
            try:
                parsed = json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                parsed = {"text": raw[:300]}
            return {"ok": True, "status": resp.status, "body": redact(parsed)}
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace")
        return {"ok": False, "status": e.code, "error": raw[:500]}
    except Exception as e:
        return {"ok": False, "status": 0, "error": str(e)}


def parse_tool_call(path: str, payload: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    path = (path or "/").split("?", 1)[0]
    if path in ("/tool", "/tools/call", "/mcp"):
        name = payload.get("name") or payload.get("method") or payload.get("tool") or ""
        args = payload.get("arguments") or payload.get("params") or payload.get("args") or {}
        if not isinstance(args, dict):
            args = {}
        return str(name), args
    alias = GET_ALIASES.get(path)
    if alias:
        return alias, payload if isinstance(payload, dict) else {}
    name = path.lstrip("/").replace("/", "_")
    return name, payload if isinstance(payload, dict) else {}


def tool_health(_: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "ok": True,
        "service": "studex-nexus-langchain-engine",
        "time": now(),
        "root": str(ROOT),
        "work": str(WORK),
        "orgo_key": "present" if secret_present("ORGO_API_KEY") else "missing",
        "agentmail_key": "present" if secret_present("AGENTMAIL_API_KEY") else "missing",
        "openclaw_port": tcp_open("127.0.0.1", 18789),
        "ollama_port": tcp_open("127.0.0.1", 11434),
        "mesh_llm_port": tcp_open("127.0.0.1", 3131),
        "denchclaw_port": tcp_open("127.0.0.1", 3100),
        "drive": DRIVE_DEFAULT_NAME,
    }


def tool_seats_list(_: dict[str, Any] | None = None) -> dict[str, Any]:
    data = read_seats()
    seats = data.get("seats") or {}
    return {"ok": True, "total": len(seats), "seats": seats}


def tool_seats_heartbeat(args: dict[str, Any]) -> dict[str, Any]:
    slug = (args.get("slug") or args.get("name") or "").strip().lower().replace(" ", "-")
    if not slug:
        return {"ok": False, "error": "slug required"}
    data = read_seats()
    seats = data.setdefault("seats", {})
    seat = seats.get(slug) or {"name": slug, "seat": args.get("seat") or "unassigned"}
    seat.update({
        "status": args.get("status") or "online",
        "model": args.get("model") or seat.get("model") or "local",
        "runtime": args.get("runtime") or seat.get("runtime"),
        "machine": args.get("machine") or seat.get("machine"),
        "heartbeat_at": now(),
    })
    if args.get("role"):
        seat["role"] = args["role"]
    seats[slug] = seat
    write_seats(data)
    return {"ok": True, "slug": slug, "seat": seat}


def tool_work_push(args: dict[str, Any]) -> dict[str, Any]:
    lane = (args.get("lane") or "inbox").strip().replace("..", "")
    name = (args.get("filename") or f"{now()[:10]}-note.md").strip().replace("..", "")
    content = args.get("content") or ""
    if not content:
        return {"ok": False, "error": "content required"}
    dest_dir = WORK / lane
    dest_dir.mkdir(parents=True, exist_ok=True)
    path = dest_dir / name
    path.write_text(content if content.endswith("\n") else content + "\n")
    return {"ok": True, "path": str(path), "bytes": path.stat().st_size, "drive": DRIVE_DEFAULT_NAME}


def tool_models_list(_: dict[str, Any] | None = None) -> dict[str, Any]:
    names: list[str] = []
    if tcp_open("127.0.0.1", 11434):
        ollama = http_json("GET", "http://127.0.0.1:11434/api/tags", timeout=2)
        if ollama.get("ok"):
            names = [m.get("name") for m in (ollama.get("body") or {}).get("models") or [] if m.get("name")]
    return {
        "ok": True,
        "policy": "local-first",
        "ollama": names,
        "ollama_port": tcp_open("127.0.0.1", 11434),
        "lmstudio": "http://127.0.0.1:1234/v1",
        "mesh_llm": "http://127.0.0.1:3131",
    }


def tool_deerflow_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    url = os.environ.get("DEERFLOW_URL", "http://127.0.0.1:2026")
    probe = http_json("GET", url.rstrip("/") + "/", timeout=2)
    if not probe.get("ok"):
        probe = http_json("GET", "http://127.0.0.1:8001/api", timeout=2)
    checkout = Path.home() / "deer-flow"
    return {
        "ok": bool(probe.get("ok")),
        "repo": "https://github.com/bytedance/deer-flow",
        "checkout": str(checkout),
        "checkout_exists": checkout.exists(),
        "role": "super-agent harness — research, subagents, MCP, Slack/Telegram",
        "run_on": "Orgo Super Agents Command or Global Markets — not this Mac (RAM)",
        "probe": probe,
    }


def tool_droiddesk_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    url = os.environ.get("DROIDDESK_URL", "")
    probe = http_json("GET", url.rstrip("/") + "/health", timeout=2) if url else {"ok": False, "error": "DROIDDESK_URL unset"}
    vendor = Path.home() / "grokbot-os/vendor/droiddesk"
    return {
        "ok": bool(url) and bool(probe.get("ok")),
        "repo": "https://github.com/orailnoor/DroidDesk",
        "apk": "https://github.com/orailnoor/DroidDesk/releases/tag/v1.0.0",
        "device": "Galaxy Z Fold 6",
        "vendor": str(vendor),
        "vendor_exists": vendor.exists(),
        "probe": probe,
    }


def _orgo_bases() -> list[str]:
    env = (os.environ.get("ORGO_BASE_URL") or "").rstrip("/")
    bases: list[str] = []
    for b in (ORGO_DEFAULT_BASE, env, "https://api.orgo.ai"):
        if b and b not in bases:
            bases.append(b)
    return bases


def slim_desktop(desk: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": desk.get("id"),
        "name": desk.get("name"),
        "status": desk.get("status"),
        "os": desk.get("os"),
        "cpu": desk.get("cpu"),
        "ram": desk.get("ram"),
        "always_on": desk.get("always_on"),
    }


def tool_orgo_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    if not secret_present("ORGO_API_KEY"):
        return {"ok": False, "error": "ORGO_API_KEY missing — paste into ~/.studex-os/secrets.env or keep ~/.openclaw/keys/orgo_live.key"}
    key = os.environ["ORGO_API_KEY"]
    headers = {"Authorization": f"Bearer {key}"}
    listed = None
    base_used = ORGO_DEFAULT_BASE
    for base in _orgo_bases():
        listed = http_json("GET", f"{base}/workspaces", headers=headers, timeout=8)
        if listed.get("ok"):
            base_used = base
            break
    if not listed or not listed.get("ok"):
        return {"ok": False, "docs": "https://docs.orgo.ai/api-reference/introduction", "error": (listed or {}).get("error"), "status": (listed or {}).get("status")}
    body = listed.get("body") or {}
    workspaces = body.get("workspaces") or body.get("projects") or []
    desks: list[dict[str, Any]] = []
    for ws in workspaces:
        wid = (ws or {}).get("id")
        if not wid:
            continue
        detail = http_json("GET", f"{base_used}/workspaces/{wid}", headers=headers, timeout=10)
        if not detail.get("ok"):
            continue
        for desk in (detail.get("body") or {}).get("desktops") or []:
            if isinstance(desk, dict):
                desks.append(slim_desktop(desk))
    running = [d for d in desks if d.get("status") == "running"]
    return {
        "ok": True,
        "docs": "https://docs.orgo.ai/api-reference/introduction",
        "base": base_used,
        "workspace_count": len(workspaces),
        "desktops": desks,
        "running": [d.get("name") for d in running],
        "running_count": len(running),
    }


def tool_agentmail_inboxes(_: dict[str, Any] | None = None) -> dict[str, Any]:
    if not secret_present("AGENTMAIL_API_KEY"):
        return {"ok": False, "error": "AGENTMAIL_API_KEY missing"}
    raw = http_json("GET", "https://api.agentmail.to/v0/inboxes", headers={"Authorization": f"Bearer {os.environ['AGENTMAIL_API_KEY']}"})
    if not raw.get("ok"):
        return raw
    body = raw.get("body") or {}
    inboxes = body.get("inboxes") or []
    slim = [{"inbox_id": i.get("inbox_id") or i.get("email"), "display_name": i.get("display_name"), "status": i.get("status")} for i in inboxes if isinstance(i, dict)]
    return {"ok": True, "count": body.get("count", len(slim)), "inboxes": slim, "send": "blocked until AGENTMAIL_SEND=yes"}


def tool_openclaw_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    port = tcp_open("127.0.0.1", 18789)
    health = http_json("GET", "http://127.0.0.1:18789/health", timeout=2) if port else {"ok": False, "error": "port closed"}
    cfg = Path.home() / ".openclaw" / "openclaw.json"
    channels: list[str] = []
    if cfg.exists():
        try:
            data = json.loads(cfg.read_text())
            ch = (data.get("channels") or {})
            channels = [k for k, v in ch.items() if isinstance(v, dict) and v.get("enabled") is not False]
        except json.JSONDecodeError:
            channels = []
    return {
        "ok": bool(health.get("ok")),
        "port": 18789,
        "listen": port,
        "health": health,
        "channels": channels,
        "config": str(cfg),
    }


def tool_drive_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    data = read_json(DRIVE_MAP, {})
    folder_id = data.get("folder_id") or os.environ.get("DRIVE_FOLDER_ID") or DRIVE_DEFAULT_ID
    lanes = data.get("lanes") or {}
    return {
        "ok": True,
        "name": data.get("name") or DRIVE_DEFAULT_NAME,
        "folder_id": folder_id,
        "url": data.get("url") or f"https://drive.google.com/drive/folders/{folder_id}",
        "lanes": lanes,
        "local_work": str(WORK),
        "sync": "MCP google-drive connected in this session; engine keeps local work/ as the write sink",
    }


def tool_buzz_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    nest = Path.home() / ".openclaw" / "keys" / "buzz-agents"
    agents = sorted(p.stem for p in nest.glob("*.env")) if nest.exists() else []
    cli = Path.home() / ".local" / "bin" / "buzz"
    return {
        "ok": bool(agents),
        "relay": os.environ.get("BUZZ_COMMUNITY", "wss://studex-agents.communities.buzz.xyz"),
        "cli": str(cli) if cli.exists() else None,
        "agents_on_disk": agents,
        "count": len(agents),
        "membership": "required — historic 403 relay_membership_required; nest stays dark until Agent Lord confirms",
    }


def tool_hermes_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    binary = Path.home() / ".local" / "bin" / "hermes"
    probe = http_json("GET", "http://127.0.0.1:8085/health", timeout=2)
    return {
        "ok": binary.exists() or bool(probe.get("ok")),
        "cli": str(binary) if binary.exists() else None,
        "tunnel": "hermes.studex-group.com",
        "local_8085": probe,
        "vm": "keep",
        "policy": "local models first",
    }


def tool_denchclaw_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    p3100 = tcp_open("127.0.0.1", 3100)
    p19001 = tcp_open("127.0.0.1", 19001)
    health = http_json("GET", "http://127.0.0.1:3100/health", timeout=2) if p3100 else {"ok": False, "error": "3100 closed"}
    return {
        "ok": bool(health.get("ok")),
        "ui": "http://127.0.0.1:3100",
        "gateway": "http://127.0.0.1:19001",
        "listen_3100": p3100,
        "listen_19001": p19001,
        "health": health,
    }


def tool_grokbot_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    root = Path.home() / "grokbot-os"
    wrangler = root / "wrangler.jsonc"
    return {
        "ok": root.exists(),
        "root": str(root),
        "wrangler": wrangler.exists(),
        "role": "OpenClaw agent + grokbot-os Discord/Slack slash",
        "discord": "OpenClaw discord channel enabled; slash worker waits on application/guild/channel IDs",
        "slack": "OpenClaw slack socket enabled (etherdoge); extra channel IDs pending",
    }


def tool_businesses_list(_: dict[str, Any] | None = None) -> dict[str, Any]:
    data = read_json(BUSINESSES, {"businesses": {}})
    biz = data.get("businesses") or {}
    return {"ok": True, "total": len(biz), "businesses": biz}


def tool_fleet_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    probes = {
        "engine": tool_health({}),
        "openclaw": tool_openclaw_status({}),
        "orgo": tool_orgo_status({}),
        "agentmail": tool_agentmail_inboxes({}),
        "drive": tool_drive_status({}),
        "buzz": tool_buzz_status({}),
        "deerflow": tool_deerflow_status({}),
        "droiddesk": tool_droiddesk_status({}),
        "hermes": tool_hermes_status({}),
        "denchclaw": tool_denchclaw_status({}),
        "grokbot": tool_grokbot_status({}),
        "models": tool_models_list({}),
        "seats": tool_seats_list({}),
        "businesses": tool_businesses_list({}),
    }
    live = [k for k, v in probes.items() if isinstance(v, dict) and v.get("ok")]
    return {
        "ok": True,
        "time": now(),
        "live": live,
        "live_count": len(live),
        "probes": {k: {"ok": (v or {}).get("ok"), **{kk: vv for kk, vv in (v or {}).items() if kk in ("count", "total", "error", "listen", "name", "folder_id", "channels", "agents_on_disk", "checkout_exists", "orgo_key", "agentmail_key")}} for k, v in probes.items()},
        "detail": probes,
    }


TOOLS = {
    "health": {"fn": tool_health, "desc": "Engine health and secret presence"},
    "seats_list": {"fn": tool_seats_list, "desc": "List Nexus seats.json"},
    "seats_heartbeat": {"fn": tool_seats_heartbeat, "desc": "Write a seat heartbeat"},
    "work_push": {"fn": tool_work_push, "desc": "Push an artifact into the work sink"},
    "models_list": {"fn": tool_models_list, "desc": "List local models"},
    "orgo_status": {"fn": tool_orgo_status, "desc": "Orgo Global Markets VM status"},
    "agentmail_inboxes": {"fn": tool_agentmail_inboxes, "desc": "List AgentMail inboxes"},
    "deerflow_status": {"fn": tool_deerflow_status, "desc": "DeerFlow super-agent harness status"},
    "droiddesk_status": {"fn": tool_droiddesk_status, "desc": "DroidDesk Fold roaming desk status"},
    "openclaw_status": {"fn": tool_openclaw_status, "desc": "OpenClaw gateway :18789"},
    "drive_status": {"fn": tool_drive_status, "desc": "Death Star Google Drive work sink"},
    "buzz_status": {"fn": tool_buzz_status, "desc": "Buzz.xyz nest on disk"},
    "hermes_status": {"fn": tool_hermes_status, "desc": "Hermes CLI and tunnel"},
    "denchclaw_status": {"fn": tool_denchclaw_status, "desc": "DenchClaw CRM ports"},
    "grokbot_status": {"fn": tool_grokbot_status, "desc": "Grokbot Discord/Slack worker"},
    "businesses_list": {"fn": tool_businesses_list, "desc": "StudEx Group businesses.json"},
    "fleet_status": {"fn": tool_fleet_status, "desc": "Composite live fleet probe"},
}


def dispatch(name: str, args: dict[str, Any] | None = None) -> dict[str, Any]:
    tool = TOOLS.get(name)
    if not tool:
        return {"ok": False, "error": f"unknown tool {name}", "tools": list(TOOLS)}
    return tool["fn"](args or {})


def langchain_bind() -> Any:
    try:
        from langchain_core.tools import StructuredTool
        from pydantic import BaseModel, Field
    except Exception:
        return None

    class Heartbeat(BaseModel):
        slug: str
        status: str = "online"
        model: str = "local"
        runtime: str = ""
        machine: str = ""
        role: str = ""
        seat: str = ""

    class WorkPush(BaseModel):
        lane: str = Field(default="inbox")
        filename: str = Field(default="note.md")
        content: str

    bound = []
    for name, meta in TOOLS.items():
        if name == "seats_heartbeat":
            bound.append(StructuredTool.from_function(func=lambda **kw: tool_seats_heartbeat(kw), name=name, description=meta["desc"], args_schema=Heartbeat))
        elif name == "work_push":
            bound.append(StructuredTool.from_function(func=lambda **kw: tool_work_push(kw), name=name, description=meta["desc"], args_schema=WorkPush))
        else:
            bound.append(StructuredTool.from_function(func=lambda n=name: dispatch(n, {}), name=name, description=meta["desc"]))
    return bound


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args: Any) -> None:
        sys.stderr.write("[engine] " + (fmt % args) + "\n")

    def _send(self, code: int, payload: Any) -> None:
        body = json.dumps(payload).encode()
        try:
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except BrokenPipeError:
            return

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        path = self.path.split("?", 1)[0]
        if path == "/tools":
            self._send(200, {"tools": {k: v["desc"] for k, v in TOOLS.items()}})
            return
        name = GET_ALIASES.get(path)
        if not name:
            self._send(404, {"ok": False, "error": "not found"})
            return
        self._send(200, dispatch(name, {}))

    def do_POST(self) -> None:  # noqa: N802
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw.decode() or "{}")
        except json.JSONDecodeError:
            self._send(400, {"ok": False, "error": "invalid json"})
            return
        if not isinstance(payload, dict):
            self._send(400, {"ok": False, "error": "json object required"})
            return
        name, args = parse_tool_call(self.path, payload)
        self._send(200, dispatch(name, args))


def serve_http(port: int) -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    httpd = ThreadingHTTPServer((HOST, port), Handler)
    print(json.dumps({"ok": True, "listen": f"http://{HOST}:{port}", "langchain": bool(langchain_bind())}))
    httpd.serve_forever()


def serve_stdio() -> None:
    """Minimal MCP stdio: tools/list + tools/call JSON-RPC."""
    while True:
        line = sys.stdin.readline()
        if not line:
            break
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            continue
        mid = msg.get("id")
        method = msg.get("method")
        if method == "initialize":
            out = {"jsonrpc": "2.0", "id": mid, "result": {"protocolVersion": "2024-11-05", "capabilities": {"tools": {}}, "serverInfo": {"name": "studex-os", "version": "1.1.0"}}}
        elif method == "tools/list":
            tools = [{"name": k, "description": v["desc"], "inputSchema": {"type": "object"}} for k, v in TOOLS.items()]
            out = {"jsonrpc": "2.0", "id": mid, "result": {"tools": tools}}
        elif method == "tools/call":
            params = msg.get("params") or {}
            result = dispatch(params.get("name"), params.get("arguments") or {})
            out = {"jsonrpc": "2.0", "id": mid, "result": {"content": [{"type": "text", "text": json.dumps(result)}]}}
        elif method in ("notifications/initialized", "notifications/cancelled"):
            continue
        else:
            out = {"jsonrpc": "2.0", "id": mid, "error": {"code": -32601, "message": str(method)}}
        sys.stdout.write(json.dumps(out) + "\n")
        sys.stdout.flush()


def main() -> None:
    load_secrets()
    parser = argparse.ArgumentParser()
    parser.add_argument("--stdio", action="store_true")
    parser.add_argument("--port", type=int, default=ENGINE_PORT)
    args = parser.parse_args()
    if args.stdio:
        serve_stdio()
        return
    serve_http(args.port)


if __name__ == "__main__":
    main()

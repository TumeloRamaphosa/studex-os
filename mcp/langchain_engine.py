#!/usr/bin/env python3
"""StudEx Nexus LangChain MCP engine.

Shared tool bus for OpenClaw, Hermes, Herdr, and OpenRig.
Local models first. Secrets from ~/.studex-os/secrets.env only.
"""
from __future__ import annotations

import argparse
import json
import os
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
SECRETS = Path.home() / ".studex-os/secrets.env"
HOST = os.environ.get("STUDEX_ENGINE_HOST", "127.0.0.1")
ENGINE_PORT = int(os.environ.get("STUDEX_ENGINE_PORT", "8765"))


def _ingest_env_file(path: Path, allow: set[str] | None = None) -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        key = k.strip()
        if allow and key not in allow:
            continue
        os.environ.setdefault(key, v.strip().strip('"').strip("'"))


def load_secrets() -> None:
    SECRETS.parent.mkdir(parents=True, exist_ok=True)
    _ingest_env_file(SECRETS)
    _ingest_env_file(
        Path.home() / ".openclaw" / "keys" / "agent_keys.env",
        allow={"AGENTMAIL_API_KEY", "ORGO_API_KEY", "ORGO_BASE_URL", "ORGO_COMPUTER_ID"},
    )


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def read_seats() -> dict[str, Any]:
    if not SEATS.exists():
        return {"system": "StudEx Nexus", "seats": {}}
    return json.loads(SEATS.read_text())


def write_seats(data: dict[str, Any]) -> None:
    SEATS.parent.mkdir(parents=True, exist_ok=True)
    SEATS.write_text(json.dumps(data, indent=2) + "\n")
    dash = ROOT / "dashboard" / "seats.json"
    dash.parent.mkdir(parents=True, exist_ok=True)
    dash.write_text(json.dumps(data, indent=2) + "\n")


def http_json(method: str, url: str, headers: dict[str, str] | None = None, body: Any = None, timeout: int = 20) -> Any:
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
            return {"ok": True, "status": resp.status, "body": json.loads(raw) if raw else {}}
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace")
        return {"ok": False, "status": e.code, "error": raw[:500]}
    except Exception as e:
        return {"ok": False, "status": 0, "error": str(e)}


def tool_health(_: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "ok": True,
        "service": "studex-nexus-langchain-engine",
        "time": now(),
        "root": str(ROOT),
        "work": str(WORK),
        "orgo_key": "present" if os.environ.get("ORGO_API_KEY") else "missing",
        "agentmail_key": "present" if os.environ.get("AGENTMAIL_API_KEY") else "missing",
        "ollama": None,
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
    return {"ok": True, "path": str(path), "bytes": path.stat().st_size}


def tool_models_list(_: dict[str, Any] | None = None) -> dict[str, Any]:
    ollama = http_json("GET", "http://127.0.0.1:11434/api/tags", timeout=2)
    names = []
    if ollama.get("ok"):
        names = [m.get("name") for m in (ollama.get("body") or {}).get("models") or [] if m.get("name")]
    return {
        "ok": True,
        "policy": "local-first",
        "ollama": names,
        "lmstudio": "http://127.0.0.1:1234/v1",
        "mesh_llm": "http://127.0.0.1:3131",
    }


def tool_deerflow_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    url = os.environ.get("DEERFLOW_URL", "http://127.0.0.1:2026")
    probe = http_json("GET", url.rstrip("/") + "/", timeout=2)
    if not probe.get("ok"):
        probe = http_json("GET", "http://127.0.0.1:8001/api", timeout=2)
    return {
        "ok": bool(probe.get("ok")),
        "repo": "https://github.com/bytedance/deer-flow",
        "checkout": str(Path.home() / "deer-flow"),
        "role": "super-agent harness — research, subagents, MCP, Slack/Telegram",
        "run_on": "Orgo Super Agents Command or Global Markets — not this Mac (RAM)",
        "probe": probe,
    }


def tool_droiddesk_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    url = os.environ.get("DROIDDESK_URL", "")
    probe = http_json("GET", url.rstrip("/") + "/health", timeout=2) if url else {"ok": False, "error": "DROIDDESK_URL unset"}
    return {
        "ok": bool(url) and bool(probe.get("ok")),
        "repo": "https://github.com/orailnoor/DroidDesk",
        "apk": "https://github.com/orailnoor/DroidDesk/releases/tag/v1.0.0",
        "device": "Galaxy Z Fold 6",
        "vendor": str(Path.home() / "grokbot-os/vendor/droiddesk"),
        "probe": probe,
    }


def tool_orgo_status(_: dict[str, Any] | None = None) -> dict[str, Any]:
    key = os.environ.get("ORGO_API_KEY")
    base = os.environ.get("ORGO_BASE_URL", "https://api.orgo.ai").rstrip("/")
    computer = os.environ.get("ORGO_COMPUTER_ID")
    if not key:
        return {"ok": False, "error": "ORGO_API_KEY missing — paste into ~/.studex-os/secrets.env"}
    headers = {"Authorization": f"Bearer {key}"}
    listed = http_json("GET", f"{base}/v1/computers", headers=headers)
    result: dict[str, Any] = {"ok": listed.get("ok"), "list": listed}
    if computer:
        result["computer"] = http_json("GET", f"{base}/v1/computers/{computer}", headers=headers)
    return result


def tool_agentmail_inboxes(_: dict[str, Any] | None = None) -> dict[str, Any]:
    key = os.environ.get("AGENTMAIL_API_KEY")
    if not key:
        return {"ok": False, "error": "AGENTMAIL_API_KEY missing"}
    return http_json("GET", "https://api.agentmail.to/v0/inboxes", headers={"Authorization": f"Bearer {key}"})


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

    bound = [
        StructuredTool.from_function(func=lambda: tool_health({}), name="health", description=TOOLS["health"]["desc"]),
        StructuredTool.from_function(func=lambda: tool_seats_list({}), name="seats_list", description=TOOLS["seats_list"]["desc"]),
        StructuredTool.from_function(func=lambda **kw: tool_seats_heartbeat(kw), name="seats_heartbeat", description=TOOLS["seats_heartbeat"]["desc"], args_schema=Heartbeat),
        StructuredTool.from_function(func=lambda **kw: tool_work_push(kw), name="work_push", description=TOOLS["work_push"]["desc"], args_schema=WorkPush),
        StructuredTool.from_function(func=lambda: tool_models_list({}), name="models_list", description=TOOLS["models_list"]["desc"]),
        StructuredTool.from_function(func=lambda: tool_orgo_status({}), name="orgo_status", description=TOOLS["orgo_status"]["desc"]),
        StructuredTool.from_function(func=lambda: tool_agentmail_inboxes({}), name="agentmail_inboxes", description=TOOLS["agentmail_inboxes"]["desc"]),
    ]
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
        if path in ("/", "/health"):
            self._send(200, tool_health({}))
            return
        if path == "/seats":
            self._send(200, tool_seats_list({}))
            return
        if path == "/models":
            self._send(200, tool_models_list({}))
            return
        if path == "/orgo":
            self._send(200, tool_orgo_status({}))
            return
        if path == "/agentmail":
            self._send(200, tool_agentmail_inboxes({}))
            return
        if path == "/deerflow":
            self._send(200, tool_deerflow_status({}))
            return
        if path == "/droiddesk":
            self._send(200, tool_droiddesk_status({}))
            return
        if path == "/tools":
            self._send(200, {"tools": {k: v["desc"] for k, v in TOOLS.items()}})
            return
        self._send(404, {"ok": False, "error": "not found"})

    def do_POST(self) -> None:  # noqa: N802
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw.decode() or "{}")
        except json.JSONDecodeError:
            self._send(400, {"ok": False, "error": "invalid json"})
            return
        path = self.path.split("?", 1)[0]
        if path == "/mcp":
            name = payload.get("method") or payload.get("name")
            args = payload.get("params") or payload.get("arguments") or {}
            self._send(200, dispatch(name, args))
            return
        name = path.lstrip("/").replace("/", "_")
        self._send(200, dispatch(name, payload))


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
            out = {"jsonrpc": "2.0", "id": mid, "result": {"protocolVersion": "2024-11-05", "capabilities": {"tools": {}}, "serverInfo": {"name": "studex-os", "version": "1.0.0"}}}
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

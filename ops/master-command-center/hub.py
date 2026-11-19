#!/usr/bin/env python3
"""
Master Command Center — Orchestrator

Single process that owns:
  * the 8-agent mesh registry + health probing
  * the task queue, routing table, and execution
  * the audit log
  * the real-time event bus (WebSocket :8080)

Runs on :3000 alongside the local store (:5005).

Endpoints
  GET  /api/status              overall status, agent table, counters
  GET  /api/agents              agent registry with live probes
  POST /api/tasks/submit        submit a task
  GET  /api/tasks               list tasks
  GET  /api/tasks/{id}          one task
  GET  /api/companies            the 7 operations
  GET  /api/events              recent event stream (poll fallback)
  GET  /                          dashboard UI
  GET  /health

Design notes
  * Agents are probed for real. An agent that does not answer its probe is
    reported OFFLINE, never assumed up.
  * Execution goes through the "runner" abstraction. A runner may be a real
    local process, a Hermes one-shot session, or a stub that reports that the
    agent has no local runtime. The stub is explicit, never silent.
"""

from __future__ import annotations

import json
import os
import subprocess
import threading
import time
import uuid
from datetime import datetime, timezone

from aiohttp import web

HUB_PORT = int(os.environ.get("MASTER_HUB_PORT", "3000"))
STORE_URL = os.environ.get("MASTER_STORE_URL", "http://127.0.0.1:5005")
LOG_DIR = os.environ.get("MASTER_LOG_DIR", "/logs/hermes")
OWNER = "Tumelo Ramaphosa"

# ── Agent mesh definition ────────────────────────────────────────────────
# Each entry: expected port, health path, routing tags, runner kind.
# `runner` decides HOW work is executed:
#   local    -> a local HTTP service on the expected port
#   hermes   -> a Hermes one-shot agent session
#   stub     -> no local runtime exists; documented as unavailable
AGENTS = [
    {
        "id": "paperclip",
        "name": "Paperclip",
        "port": 3001,
        "health": "/health",
        "domain": "content-marketing",
        "capabilities": ["content", "marketing", "social", "seo"],
        "runner": "hermes",
        "repo": "/workspace/studex-nexus/content/paperclip-page",
        "source": "studex-nexus/MONOREPO-MAP.md -> content/paperclip-page",
    },
    {
        "id": "denchclaw",
        "name": "DenchClaw",
        "port": 3002,
        "health": "/health",
        "domain": "system-management-crm",
        "capabilities": ["crm", "email-outreach", "system", "lead-gen"],
        "runner": "local",
        "repo": "/workspace/denchclaw",
        "source": "/workspace/denchclaw (Node/TS app, deps not installed at build time)",
    },
    {
        "id": "cashclaw",
        "name": "CashClaw",
        "port": 3003,
        "health": "/api/status",
        "domain": "finance",
        "capabilities": ["finance", "invoicing", "earnings", "pricing"],
        "runner": "local",
        "repo": "/workspace/cashclaw",
        "source": "/workspace/cashclaw (Node/ESM app, express dashboard)",
    },
    {
        "id": "kimi",
        "name": "Kimi Claw",
        "port": 3004,
        "health": "/health",
        "domain": "special-projects",
        "capabilities": ["special", "agent-specs", "code-generation"],
        "runner": "stub",
        "repo": "/workspace/agency-agents/integrations/kimi",
        "source": "agency-agents/integrations/kimi — Kimi Code CLI spec generator, no server",
    },
    {
        "id": "page-agent",
        "name": "page-agent",
        "port": 3005,
        "health": "/health",
        "domain": "content-marketing",
        "capabilities": ["landing-pages", "content", "web"],
        "runner": "stub",
        "repo": None,
        "source": "referenced in studex-auto-meat handover + nozi model house; no local code",
    },
    {
        "id": "openinterpreter",
        "name": "openinterpreter",
        "port": 3006,
        "health": "/health",
        "domain": "research",
        "capabilities": ["research", "code-execution", "analysis"],
        "runner": "stub",
        "repo": None,
        "source": "no local code; upstream project not vendored",
    },
    {
        "id": "odysseus",
        "name": "odysseus",
        "port": 3007,
        "health": "/health",
        "domain": "research",
        "capabilities": ["research", "deep-research", "scraping"],
        "runner": "stub",
        "repo": None,
        "source": "no local code anywhere in /workspace",
    },
    {
        "id": "cua",
        "name": "cua",
        "port": 3008,
        "health": "/health",
        "domain": "system-management",
        "capabilities": ["computer-use", "ui-automation", "system"],
        "runner": "stub",
        "repo": None,
        "source": "trycua/cua — Hermes has built-in computer_use toolset (local-desktop only); no server",
    },
]

# ── Routing table (from the mission brief) ───────────────────────────────
ROUTES = {
    "content": ["paperclip", "page-agent"],
    "marketing": ["paperclip", "page-agent"],
    "social": ["paperclip", "page-agent"],
    "seo": ["paperclip"],
    "finance": ["cashclaw"],
    "invoicing": ["cashclaw"],
    "pricing": ["cashclaw"],
    "research": ["openinterpreter", "odysseus"],
    "analysis": ["openinterpreter", "odysseus"],
    "system": ["denchclaw", "cua"],
    "crm": ["denchclaw"],
    "lead-gen": ["denchclaw"],
    "special": ["kimi"],
}

COMPANIES = [
    {"id": "meat", "name": "StudEx Meat", "status": "live", "note": "Shopify + WhatsApp + War Room"},
    {"id": "coffee", "name": "StudEx Coffee", "status": "in-progress", "note": "studex-nexus/verticals/coffee"},
    {"id": "markets", "name": "Global Markets", "status": "in-progress", "note": "studex-nexus/verticals/global-markets"},
    {"id": "wheat", "name": "Wheat", "status": "planned", "note": "no code in workspace"},
    {"id": "ai", "name": "StudEx AI", "status": "docs-only", "note": "docs exist, no running agents"},
    {"id": "exchange", "name": "Exchange", "status": "planned", "note": "no code in workspace"},
    {"id": "gaming", "name": "Gaming Studio", "status": "not-running", "note": "gaming-platform code; missing Redis/pytest"},
]

# ── Audit log ────────────────────────────────────────────────────────────
_log_lock = threading.Lock()
_event_subscribers: list = []
_event_history: list = []
_seq = {"n": 0}


def utcnow() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def log_event(kind: str, message: str, **fields):
    ts = utcnow()
    day = ts[:10]
    rec = {"ts": ts, "kind": kind, "message": message, **fields}
    os.makedirs(LOG_DIR, exist_ok=True)
    with _log_lock:
        with open(os.path.join(LOG_DIR, f"{day}.log"), "a") as f:
            f.write(json.dumps(rec) + "\n")
        _seq["n"] += 1
        rec["seq"] = _seq["n"]
        _event_history.append(rec)
        if len(_event_history) > 500:
            del _event_history[: len(_event_history) - 500]
        for cb in list(_event_subscribers):
            try:
                cb(rec)
            except Exception:
                pass
    return rec


# ── Store client ─────────────────────────────────────────────────────────
import urllib.request
import urllib.error


def store(method: str, path: str, payload=None):
    url = STORE_URL + path
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            body = r.read().decode()
            return r.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode()[:200]}
    except Exception as e:
        return 0, {"error": str(e)}


def store_set(collection: str, doc_id: str, payload: dict, merge: bool = True):
    code, body = store("PATCH" if merge else "PUT", f"/v1/{collection}/{doc_id}", payload)
    return body


def store_get(collection: str, doc_id: str):
    code, body = store("GET", f"/v1/{collection}/{doc_id}")
    return body if code == 200 else None


def store_list(collection: str):
    code, body = store("GET", f"/v1/{collection}")
    return body.get("docs", []) if code == 200 else []


# ── Agent probing ────────────────────────────────────────────────────────
def probe_agent(agent: dict) -> dict:
    """Real probe. Never reports UP without an actual response."""
    import socket
    result = dict(agent)
    result["last_probe"] = utcnow()
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1.5)
    try:
        s.connect(("127.0.0.1", agent["port"]))
        s.close()
        result["port_open"] = True
    except Exception:
        result["port_open"] = False

    result["http_ok"] = False
    if result["port_open"]:
        try:
            import urllib.request
            with urllib.request.urlopen(
                f"http://127.0.0.1:{agent['port']}{agent['health']}", timeout=3
            ) as r:
                result["http_ok"] = 200 <= r.status < 400
                result["http_status"] = r.status
        except Exception as e:
            result["http_error"] = str(e)[:120]

    if result["http_ok"]:
        result["status"] = "ONLINE"
    elif result["port_open"]:
        result["status"] = "DEGRADED"
    else:
        result["status"] = "OFFLINE"

    result["runner"] = agent["runner"]
    result["executable"] = agent["runner"] != "stub"
    return result


def probe_all() -> list[dict]:
    return [probe_agent(a) for a in AGENTS]


# ── Task execution ───────────────────────────────────────────────────────
def route_task(task: dict) -> list[str]:
    """Pick agents for a task by capability tags / domain keywords."""
    text = (task.get("title", "") + " " + task.get("description", "")).lower()
    tags = set(task.get("tags", []) or [])
    tags = {t.lower() for t in tags}

    hits = []
    for key, agents in ROUTES.items():
        if key in tags or key in text:
            for a in agents:
                if a not in hits:
                    hits.append(a)

    if not hits:
        domain = (task.get("domain") or "").lower()
        if domain in ROUTES:
            hits = list(ROUTES[domain])
    if not hits:
        hits = ["denchclaw"]
    return hits


def run_agent(agent_id: str, task: dict, timeout: int = 600) -> dict:
    """Execute a task on an agent. Returns a result dict with real evidence."""
    agent = next((a for a in AGENTS if a["id"] == agent_id), None)
    if not agent:
        return {"ok": False, "error": f"unknown agent {agent_id}"}

    started = utcnow()
    if agent["runner"] == "stub":
        return {
            "ok": False,
            "agent": agent_id,
            "error": "NO_LOCAL_RUNTIME",
            "detail": f"{agent['name']} has no local runtime in this environment. "
                      f"Origin: {agent['source']}",
            "evidence": "no process, no port, no repo entry",
            "started_at": started,
            "completed_at": utcnow(),
        }

    if agent["runner"] == "hermes":
        prompt = (
            f"You are {agent['name']}, a StudEx agent. Execute the following task "
            f"in your workspace ({agent['repo'] or '/workspace'}).\n\n"
            f"TASK: {task.get('title','')}\n"
            f"DETAIL: {task.get('description','')}\n"
            f"ACCEPTANCE: {task.get('acceptance_criteria','')}\n\n"
            f"Write any output artifacts under {agent['repo'] or '/workspace'} and "
            f"finish with a short summary of what you did and how to verify it."
        )
        try:
            proc = subprocess.run(
                ["hermes", "chat", "-q", prompt, "-Q", "--provider", "minimax"],
                capture_output=True, text=True, timeout=timeout,
                cwd=agent["repo"] or "/workspace",
            )
            out = (proc.stdout or "").strip()
            err = (proc.stderr or "").strip()
            return {
                "ok": proc.returncode == 0 and bool(out),
                "agent": agent_id,
                "runner": "hermes",
                "exit_code": proc.returncode,
                "output": out[-4000:],
                "stderr": err[-1000:],
                "started_at": started,
                "completed_at": utcnow(),
            }
        except subprocess.TimeoutExpired:
            return {
                "ok": False, "agent": agent_id, "runner": "hermes",
                "error": "TIMEOUT",
                "detail": f"exceeded {timeout}s",
                "started_at": started, "completed_at": utcnow(),
            }
        except Exception as e:
            return {
                "ok": False, "agent": agent_id, "runner": "hermes",
                "error": str(e)[:200],
                "started_at": started, "completed_at": utcnow(),
            }

    # runner == "local": POST the task to the agent's own HTTP API.
    import urllib.request
    import urllib.error
    url = f"http://127.0.0.1:{agent['port']}/api/tasks/execute"
    try:
        req = urllib.request.Request(
            url, data=json.dumps(task).encode(), method="POST"
        )
        req.add_header("Content-Type", "application/json")
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read().decode()
            return {
                "ok": 200 <= r.status < 300,
                "agent": agent_id,
                "runner": "local",
                "http_status": r.status,
                "output": body[:4000],
                "started_at": started,
                "completed_at": utcnow(),
            }
    except Exception as e:
        return {
            "ok": False, "agent": agent_id, "runner": "local",
            "error": str(e)[:200],
            "detail": f"POST {url} failed — agent service not accepting work",
            "started_at": started, "completed_at": utcnow(),
        }


def execute_task(task_id: str):
    """Run one task through its routed agents. Retry once, then escalate."""
    task = store_get("tasks", task_id)
    if not task:
        log_event("task.error", "task not found", task_id=task_id)
        return

    task["status"] = "IN_PROGRESS"
    task["startedAt"] = utcnow()
    store_set("tasks", task_id, task)
    log_event("task.start", f"task started: {task.get('title')}", task_id=task_id)
    publish_state()

    targets = task.get("assignedTo") or route_task(task)
    task["assignedTo"] = targets
    store_set("tasks", task_id, task)

    results = []
    for agent_id in targets:
        log_event("task.route", f"routing to {agent_id}", task_id=task_id, agent=agent_id)
        res = run_agent(agent_id, task)
        results.append(res)
        if res.get("ok"):
            log_event("task.agent_ok", f"{agent_id} completed", task_id=task_id, agent=agent_id)
            break  # first success wins; multi-agent fan-out is recorded in results
        # retry once
        log_event("task.retry", f"retrying {agent_id} once", task_id=task_id, agent=agent_id)
        res2 = run_agent(agent_id, task)
        res2["retried"] = True
        results.append(res2)
        if res2.get("ok"):
            log_event("task.agent_ok", f"{agent_id} completed on retry", task_id=task_id, agent=agent_id)
            break

    succeeded = any(r.get("ok") for r in results)
    task["status"] = "DONE" if succeeded else "ESCALATED"
    task["completedAt"] = utcnow()
    task["results"] = results
    task["attempts"] = len(results)

    store_set("tasks", task_id, task)
    store_set("tasks", task_id, {"result": {
        "ok": succeeded,
        "taskId": task_id,
        "title": task.get("title"),
        "completedAt": task["completedAt"],
        "agents": targets,
        "evidence": results,
    }}, merge=True)

    if succeeded:
        log_event("task.done", f"Task completed: {task.get('title')}. Results in dashboard.",
                  task_id=task_id)
    else:
        log_event("task.escalated",
                  f"Task failed after retry. Escalating to {OWNER}: {task.get('title')}",
                  task_id=task_id, attempts=len(results))
    publish_state()


# ── State broadcast ──────────────────────────────────────────────────────
_state_lock = threading.Lock()
_last_state: dict = {}


def build_state() -> dict:
    agents = probe_all()
    tasks = store_list("tasks")
    counts = {"TODO": 0, "IN_PROGRESS": 0, "DONE": 0, "ESCALATED": 0, "FAILED": 0}
    for t in tasks:
        s = t.get("status", "TODO")
        counts[s] = counts.get(s, 0) + 1
    online = sum(1 for a in agents if a["status"] == "ONLINE")
    return {
        "ts": utcnow(),
        "hub": "Master Command Center",
        "owner": OWNER,
        "agents": agents,
        "agent_summary": {
            "total": len(agents),
            "online": online,
            "offline": sum(1 for a in agents if a["status"] == "OFFLINE"),
            "degraded": sum(1 for a in agents if a["status"] == "DEGRADED"),
            "executable": sum(1 for a in agents if a["executable"]),
        },
        "tasks": {"counts": counts, "recent": tasks[-25:]},
        "companies": COMPANIES,
        "store": STORE_URL,
    }


def publish_state():
    global _last_state
    with _state_lock:
        st = build_state()
        _last_state = st
    for cb in list(_event_subscribers):
        try:
            cb({"ts": st["ts"], "kind": "state", "message": "state update", "state": st})
        except Exception:
            pass


def get_state() -> dict:
    with _state_lock:
        if _last_state:
            return _last_state
    return build_state()


# ── HTTP handlers ────────────────────────────────────────────────────────
DASHBOARD_HTML = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>StudEx Master Command Center</title>
<style>
:root{--gold:#d4af37;--bg:#0b0b0d;--panel:#15151a;--line:#2a2a32;--fg:#e8e8ec;
--muted:#8a8a96;--ok:#3ddc84;--warn:#ffb020;--bad:#ff5c5c}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);
font:14px/1.5 ui-sans-serif,-apple-system,Segoe UI,Roboto,sans-serif}
header{background:linear-gradient(90deg,#000 0%,#15151a 100%);border-bottom:2px solid var(--gold);
padding:18px 26px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
h1{font-size:19px;margin:0;letter-spacing:.4px}
.seal{width:38px;height:38px;border:2px solid var(--gold);border-radius:50%;
display:grid;place-items:center;color:var(--gold);font-weight:700;font-size:11px}
.pill{margin-left:auto;padding:6px 12px;border-radius:999px;border:1px solid var(--line);
font-size:12px;color:var(--muted)}
.pill b{color:var(--gold)}
main{padding:22px;max-width:1400px;margin:0 auto}
.grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(320px,1fr))}
.card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:16px}
.card h2{font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:var(--muted);
margin:0 0 12px;font-weight:600}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:7px 8px;color:var(--muted);font-weight:600;
border-bottom:1px solid var(--line);font-size:11px;text-transform:uppercase;letter-spacing:.6px}
td{padding:8px;border-bottom:1px solid #1e1e24}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:7px}
.ok{background:var(--ok)}.warn{background:var(--warn)}.bad{background:var(--bad)}
.stat{display:flex;gap:22px;flex-wrap:wrap;margin-bottom:18px}
.stat div b{display:block;font-size:24px;color:var(--gold);line-height:1.2}
.stat div span{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px}
.bar{height:4px;background:#1e1e24;border-radius:2px;overflow:hidden;margin-top:5px}
.bar i{display:block;height:100%;background:var(--gold)}
code{background:#1e1e24;padding:1px 6px;border-radius:4px;font-size:12px;color:var(--gold)}
.muted{color:var(--muted);font-size:12px}
.kv{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #1e1e24}
.kv span:last-child{color:var(--muted)}
#log{font-family:ui-monospace,Menlo,monospace;font-size:11px;max-height:230px;overflow-y:auto;
background:#0e0e11;border:1px solid var(--line);border-radius:8px;padding:10px}
#log div{padding:2px 0;border-bottom:1px solid #17171c}
.tag{font-size:10px;padding:2px 7px;border-radius:4px;border:1px solid var(--line);color:var(--muted)}
</style></head><body>
<header>
<div class="seal">SX</div>
<h1>StudEx Master Command Center</h1>
<div class="pill">Hermes: <b id="hermes-state">connecting…</b></div>
<div class="pill" id="ws-state">WS: —</div>
<div class="pill" id="clock"></div>
</header>
<main>
<div class="stat" id="stats"></div>
<div class="grid">
  <div class="card"><h2>Agent Mesh</h2><table>
    <thead><tr><th>Agent</th><th>Port</th><th>Status</th><th>Runner</th></tr></thead>
    <tbody id="agents"></tbody></table></div>
  <div class="card"><h2>Task Board</h2><div id="counts"></div>
    <table style="margin-top:12px"><thead><tr><th>Task</th><th>Status</th><th>Agent</th></tr></thead>
    <tbody id="tasks"></tbody></table></div>
  <div class="card"><h2>Operations</h2><div id="companies"></div></div>
  <div class="card"><h2>Live Event Log</h2><div id="log"></div></div>
</div>
</main>
<script>
const $=(s)=>document.querySelector(s);
function dot(st){const c=st==='ONLINE'?'ok':st==='DEGRADED'?'warn':'bad';return `<i class="dot ${c}"></i>`;}
function render(s){
  if(s.agents){
    $('#hermes-state').textContent = s.agent_summary.online+'/'+s.agent_summary.total+' agents reporting';
    $('#stats').innerHTML = [
      ['Agents Online',s.agent_summary.online],
      ['Offline',s.agent_summary.offline],
      ['Executable',s.agent_summary.executable],
      ['Tasks Done',s.tasks.counts.DONE||0],
      ['In Progress',s.tasks.counts.IN_PROGRESS||0],
      ['Escalated',s.tasks.counts.ESCALATED||0]
    ].map(([l,v])=>`<div><b>${v}</b><span>${l}</span></div>`).join('');
    $('#agents').innerHTML = s.agents.map(a=>`<tr>
      <td>${dot(a.status)}<b>${a.name}</b><div class="muted">${a.domain}</div></td>
      <td><code>${a.port}</code></td><td>${a.status}</td>
      <td><span class="tag">${a.runner}</span></td></tr>`).join('');
    const c=s.tasks.counts;const tot=Object.values(c).reduce((x,y)=>x+y,0)||1;
    $('#counts').innerHTML=Object.entries(c).map(([k,v])=>
      `<div class="kv"><span>${k}</span><span>${v}</span></div>
       <div class="bar"><i style="width:${(v/tot*100).toFixed(1)}%"></i></div>`).join('');
    $('#tasks').innerHTML=(s.tasks.recent||[]).slice(-12).reverse().map(t=>
      `<tr><td>${t.title||t.id}</td><td>${t.status}</td>
       <td class="muted">${(t.assignedTo||[]).join(', ')||'—'}</td></tr>`).join('');
    $('#companies').innerHTML=s.companies.map(c=>
      `<div class="kv"><span>${c.name}</span><span class="tag">${c.status}</span></div>
       <div class="muted" style="padding-bottom:6px">${c.note}</div>`).join('');
  }
}
function addLog(e){
  const d=document.createElement('div');
  d.innerHTML=`<span class="muted">${(e.ts||'').slice(11,19)}</span> <b style="color:var(--gold)">${e.kind}</b> ${e.message||''}`;
  const L=$('#log');L.prepend(d);while(L.children.length>120)L.lastChild.remove();
}
async function poll(){try{const s=await (await fetch('/api/status')).json();render(s);}catch(e){}}
async function events(){
  const ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/ws');
  ws.onopen=()=>{$('#ws-state').textContent='WS: live';};
  ws.onclose=()=>{$('#ws-state').textContent='WS: down';setTimeout(events,2000);};
  ws.onmessage=(m)=>{const e=JSON.parse(m.data);
    if(e.kind==='state')render(e.state); else addLog(e);};
}
poll();setInterval(poll,15000);events();
setInterval(()=>{$('#clock').textContent=new Date().toUTCString().slice(17,25)+' UTC';},1000);
</script></body></html>"""


async def h_status(req):
    return web.json_response(get_state())


async def h_agents(req):
    return web.json_response({"agents": probe_all(), "ts": utcnow()})


async def h_tasks(req):
    return web.json_response({"tasks": store_list("tasks")})


async def h_task(req):
    t = store_get("tasks", req.match_info["tid"])
    if not t:
        return web.json_response({"error": "not found"}, status=404)
    return web.json_response(t)


async def h_submit(req):
    try:
        body = await req.json()
    except Exception:
        return web.json_response({"error": "invalid json"}, status=400)

    title = (body.get("title") or "").strip()
    if not title:
        return web.json_response({"error": "title required"}, status=400)

    # Guard rail 1: tasks over R50,000 require owner approval.
    try:
        amount = float(body.get("amount") or body.get("value") or 0)
    except (TypeError, ValueError):
        amount = 0.0
    amount = abs(amount)
    if amount > 50000:
        body["status"] = "PENDING_APPROVAL"
        body["approval"] = {
            "required": True,
            "reason": f"Value R{amount:,.2f} exceeds R50,000 auto-execution limit",
            "requestedBy": body.get("requestedBy", "unknown"),
            "requestedAt": utcnow(),
            "approver": OWNER,
        }
        tid = body.get("id") or f"TASK-{datetime.now().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6]}"
        body["id"] = tid
        store_set("tasks", tid, body, merge=False)
        log_event("task.approval_required",
                  f"R{amount:,.2f} task held for approval: {title}", task_id=tid)
        publish_state()
        return web.json_response({
            "taskId": tid, "status": "PENDING_APPROVAL",
            "message": "Value exceeds R50,000. Held for Tumelo's approval.",
        })

    tid = body.get("id") or f"TASK-{datetime.now().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6]}"
    body["id"] = tid
    body.setdefault("status", "TODO")
    body.setdefault("submittedAt", utcnow())
    body["submittedBy"] = body.get("submittedBy", "tumelo")
    body.setdefault("tags", [])
    body["amount"] = amount
    store_set("tasks", tid, body, merge=False)
    log_event("task.submitted", f"task submitted: {title}", task_id=tid,
              amount=amount, submitted_by=body["submittedBy"])
    publish_state()

    threading.Thread(target=execute_task, args=(tid,), daemon=True).start()
    return web.json_response({
        "taskId": tid, "status": body["status"],
        "routedTo": route_task(body),
        "message": "Accepted and queued.",
    })


async def h_companies(req):
    return web.json_response({"companies": COMPANIES})


async def h_events(req):
    return web.json_response({"events": _event_history[-100:]})


async def h_health(req):
    code, _ = store("GET", "/health")
    return web.json_response({
        "status": "ok", "service": "master-hub", "port": HUB_PORT,
        "store_reachable": code == 200, "ts": utcnow(),
    })


async def h_index(req):
    return web.Response(text=DASHBOARD_HTML, content_type="text/html")


async def h_ws(req):
    ws = web.WebSocketResponse()
    await ws.prepare(req)
    queue: list = []

    def subscriber(ev):
        queue.append(ev)

    _event_subscribers.append(subscriber)
    try:
        await ws.send_json({"kind": "state", "message": "initial", "state": get_state()})
        while True:
            while queue:
                ev = queue.pop(0)
                await ws.send_json(ev)
            await asyncio.sleep(0.4)
            if ws.closed:
                break
    except Exception:
        pass
    finally:
        if subscriber in _event_subscribers:
            _event_subscribers.remove(subscriber)
    return ws


import asyncio  # noqa: E402  (used in h_ws)


async def on_startup(app):
    log_event("hub.start", "Master Hub started", port=HUB_PORT, store=STORE_URL)
    threading.Thread(target=_bg_loop, daemon=True).start()


async def _bg_loop():
    while True:
        try:
            publish_state()
        except Exception as e:
            log_event("hub.error", f"state publish failed: {e}")
        await asyncio.sleep(30)


WS_PORT = int(os.environ.get("MASTER_WS_PORT", "8080"))


async def h_ws_health(req):
    return web.json_response({"status": "ok", "service": "master-ws", "port": WS_PORT})


def build_hub_app() -> web.Application:
    app = web.Application(client_max_size=10 * 1024 * 1024)
    app.router.add_get("/", h_index)
    app.router.add_get("/health", h_health)
    app.router.add_get("/api/status", h_status)
    app.router.add_get("/api/agents", h_agents)
    app.router.add_get("/api/tasks", h_tasks)
    app.router.add_get("/api/tasks/{tid}", h_task)
    app.router.add_post("/api/tasks/submit", h_submit)
    app.router.add_get("/api/companies", h_companies)
    app.router.add_get("/api/events", h_events)
    app.router.add_get("/ws", h_ws)
    app.on_startup.append(on_startup)
    return app


def build_ws_app() -> web.Application:
    app = web.Application()
    app.router.add_get("/ws", h_ws)
    app.router.add_get("/healthz", h_ws_health)
    return app


def main():
    hub = build_hub_app()
    ws_app = build_ws_app()
    log_event("hub.boot", "Master Hub booting", port=HUB_PORT, ws_port=WS_PORT)

    async def run_all():
        runner_hub = web.AppRunner(hub)
        await runner_hub.setup()
        await web.TCPSite(runner_hub, "0.0.0.0", HUB_PORT).start()
        runner_ws = web.AppRunner(ws_app)
        await runner_ws.setup()
        await web.TCPSite(runner_ws, "0.0.0.0", WS_PORT).start()
        print(f"[master-hub] http on :{HUB_PORT}  ws on :{WS_PORT}", flush=True)
        while True:
            await asyncio.sleep(3600)

    asyncio.run(run_all())


if __name__ == "__main__":
    main()

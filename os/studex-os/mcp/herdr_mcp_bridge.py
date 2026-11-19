"""Herdr MCP Bridge - exposes Herdr fleet as MCP server for Antigravity."""
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.responses import JSONResponse
import subprocess
import json
import uvicorn

HERDR_SERVER = "localhost"
HERDR_PORT = 2244

async def herdr_list_agents():
    try:
        result = subprocess.run(
            ["herdr", "agents", "list", "--server", f"{HERDR_SERVER}:{HERDR_PORT}"],
            capture_output=True, text=True, timeout=10
        )
        return json.loads(result.stdout) if result.stdout else {"agents": []}
    except Exception as e:
        return {"error": str(e), "agents": []}

async def herdr_spawn(machine: str, task: str):
    result = subprocess.run(
        ["herdr", "spawn", "--machine", machine, "--task", task,
         "--server", f"{HERDR_SERVER}:{HERDR_PORT}"],
        capture_output=True, text=True, timeout=30
    )
    return {"status": "spawned", "machine": machine, "output": result.stdout, "error": result.stderr}

async def herdr_run(machine: str, command: str):
    result = subprocess.run(
        ["herdr", "run", "--machine", machine, command,
         "--server", f"{HERDR_SERVER}:{HERDR_PORT}"],
        capture_output=True, text=True, timeout=60
    )
    return {"machine": machine, "command": command, "output": result.stdout, "error": result.stderr}

async def herdr_status():
    try:
        result = subprocess.run(
            ["herdr", "status", "--server", f"{HERDR_SERVER}:{HERDR_PORT}"],
            capture_output=True, text=True, timeout=10
        )
        return json.loads(result.stdout) if result.stdout else {"status": "unknown"}
    except Exception as e:
        return {"error": str(e)}

async def mcp_request(request):
    params = request.get("params", {})
    tool = request.get("tool", "")
    if tool in ("herdr_list_agents", "list_agents"):
        return JSONResponse(await herdr_list_agents())
    elif tool in ("herdr_spawn", "spawn_agent"):
        return JSONResponse(await herdr_spawn(params.get("machine"), params.get("task")))
    elif tool in ("herdr_run", "run_command"):
        return JSONResponse(await herdr_run(params.get("machine"), params.get("command")))
    elif tool in ("herdr_status", "fleet_status"):
        return JSONResponse(await herdr_status())
    return JSONResponse({"error": f"Unknown tool: {tool}"})

routes = [Route("/mcp", mcp_request, methods=["POST"])]
app = Starlette(routes=routes)

if __name__ == "__main__":
    print("Herdr MCP Bridge starting on :8080")
    uvicorn.run(app, host="0.0.0.0", port=8080)

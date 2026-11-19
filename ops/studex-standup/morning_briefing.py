#!/usr/bin/env python3
"""
Studex OS — 8AM Morning Standup Briefing
Runs daily at 8:00 AM JST → posts to Discord → commits to Gitea

Cron: 0 8 * * 1-5
"""
import json
import subprocess
import requests
import os
import sys
from datetime import datetime, timezone, timedelta

# ── Config ───────────────────────────────────────────────────────
JST = timezone(timedelta(hours=9))
now = datetime.now(JST)
DATE = now.strftime("%Y-%m-%d")
TIME = now.strftime("%H:%M")
DAY = now.strftime("%A")

DISCORD_WEBHOOK = os.environ.get("DISCORD_WEBHOOK_URL", "")
ORGO_API_KEY = os.environ.get("ORGO_API_KEY", "${ORGO_API_KEY}")
ORGO_BASE = "https://www.orgo.ai/api"
LINEAR_API_KEY = os.environ.get("LINEAR_API_KEY", "")

OUTPUT_DIR = "/workspace/studex-standup"
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {"Authorization": f"Bearer {ORGO_API_KEY}"}

# ── Fleet Health ─────────────────────────────────────────────────
def check_fleet():
    """Check all 10 Orgo VMs health."""
    result = subprocess.run(
        ["curl", "-s", "-H", f"Authorization: Bearer {ORGO_API_KEY}",
         f"{ORGO_BASE}/workspaces"],
        capture_output=True, text=True, timeout=15
    )
    try:
        data = json.loads(result.stdout)
        desktops = []
        # Orgo returns workspaces[].desktops[] — flatten across all workspaces
        for ws in data.get("workspaces", []) + data.get("projects", []):
            desktops.extend(ws.get("desktops", []) or [])
        if not desktops:
            desktops = data.get("desktops", []) or []
    except Exception:
        desktops = []

    statuses = []
    for d in desktops[:10]:
        name = d.get("name", "unknown")
        desktop_id = d.get("id", "")
        status = d.get("status", "unknown")
        # Check desktop API health
        if desktop_id:
            r = requests.get(
                f"{ORGO_BASE}/workspaces/{desktop_id}/health",
                headers=HEADERS, timeout=5
            )
            health_status = "ONLINE" if r.status_code == 200 else "CHECKING"
        else:
            health_status = "UNKNOWN"
        statuses.append((name, health_status, status))
    return statuses

# ── Linear Tickets ────────────────────────────────────────────────
def get_linear_tickets():
    """Get open Linear tickets."""
    if not LINEAR_API_KEY:
        return []
    headers = {"Authorization": LINEAR_API_KEY}
    try:
        r = requests.get(
            "https://api.linear.app/graphql",
            headers=headers,
            json={"query": "{ issues(filter: { state: { name: { ne: \"Done\" } } }, first: 10) { nodes { id title state { name } priority assignee { name } } } }"},
            timeout=10
        )
        if r.status_code == 200:
            data = r.json()
            return data.get("data", {}).get("issues", {}).get("nodes", [])
    except:
        pass
    return []

# ── Build Briefing ────────────────────────────────────────────────
def build_briefing(fleet, tickets):
    online = sum(1 for _, s, _ in fleet if s == "ONLINE")
    total = len(fleet)

    # Disk alerts
    disk_alerts = [n for n, s, st in fleet if "disk" in n.lower() or "global" in n.lower()]

    lines = [
        f"**STUDEX COMMAND CENTER — MORNING BRIEFING**",
        f"**{DAY}, {DATE} | {TIME} AM JST**",
        "",
        "```",
        f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        f"FLEET STATUS — {online}/{total} ONLINE",
        f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ]

    for name, health, raw in fleet:
        icon = "✅" if health == "ONLINE" else "⚠️" if health == "CHECKING" else "❌"
        lines.append(f"  {icon} {name}")

    if disk_alerts:
        lines.append("")
        lines.append("  ⚠️  DISK ALERTS:")
        for a in disk_alerts:
            lines.append(f"      • {a}")

    lines += ["", "```", "", "**CLIENT PROJECT STATUS**", ""]

    # Known clients
    clients = [
        ("Dr. Amelia — IGH Wellness", "PROPOSAL STAGE", "80%", "Send proposal + FDE survey", "Waiting on Queen API key"),
        ("Super Agents Platform", "BUILDING", "40%", "Wire Queen + Croc to ADAM", "None"),
        ("Auto - Meat (Global Markets)", "MONITORING", "60%", "Clean 100% disk", "Orgo VNC session needed"),
        ("D@RK F@CT0Ry", "ERROR STATE", "—", "Diagnose via VNC", "VNC session needed"),
    ]

    for name, status, progress, today, blocker in clients:
        lines.append(f"**{name}**")
        lines.append(f"  Status:    {status}")
        lines.append(f"  Progress:   {progress}")
        lines.append(f"  Today:      {today}")
        lines.append(f"  Blocker:    {blocker}")
        lines.append("")

    lines += ["**BUILD PROGRESS**", "",
              "```", f"  Munder Difflin:       INSTALLING (MacBook)",]
    lines.append(f"  SWE-1.7 Pipeline:     PENDING (need Devin Pro $20/mo)")
    lines.append(f"  Herdr + VS Code:      READY")
    lines.append(f"  Kilo Cloud Agents:    PENDING (need API keys)")
    lines.append(f"  Cloudflare OS:        DEPLOYMENT PLAN READY")
    lines.append(f"  Linear Integration:   PENDING (need API key)")
    lines.append("```")
    lines.append("")

    lines += ["**TODAY'S TOP 3 ACTIONS FOR TUMELO**", ""]
    actions = [
        "1. Paste Queen API key → unlock proposals + FDE reports",
        "2. Paste Croc API key → unlock Grok research agent",
        "3. VNC into D@RK F@CT0Ry → fix ERROR_STATE",
    ]
    for a in actions:
        lines.append(f"  {a}")

    lines += ["", "**GITHUB TRENDING (08:00 AM)**", "",
              "  Top repo today: Munder Difflin (multi-agent harness)",
              "  Top AI repo:   obra/superpowers (287K ⭐ — agent discipline)",
              "  Hot today:     Cloudflare/security-audit-skill",
              "  → Full report: git.studex-group.com/studex-trending-research",
              ""]

    lines.append(f"_Generated by Hermes Agent — {DATE} {TIME} JST_")

    return "\n".join(lines)

# ── Save + Push ───────────────────────────────────────────────────
def save_and_push(briefing_text):
    filename = f"{OUTPUT_DIR}/briefing-{DATE}.md"
    with open(filename, "w") as f:
        f.write(briefing_text)
    repo_dir = OUTPUT_DIR
    try:
        subprocess.run(["git", "add", "."], cwd=repo_dir, check=True, capture_output=True)
        result = subprocess.run(
            ["git", "commit", "-m", f"8AM briefing — {DATE}"],
            cwd=repo_dir, capture_output=True, text=True
        )
        push_result = subprocess.run(
            ["git", "push", "origin", "main"],
            cwd=repo_dir, capture_output=True, text=True
        )
        return "Pushed to Gitea" if push_result.returncode == 0 else "Committed locally"
    except Exception as e:
        return f"Git error: {e}"

# ── Post to Discord ───────────────────────────────────────────────
def post_discord(text):
    if not DISCORD_WEBHOOK:
        return "No Discord webhook URL set"
    try:
        # Split into chunks if too long
        chunks = [text[i:i+1900] for i in range(0, len(text), 1900)]
        for chunk in chunks:
            r = requests.post(
                DISCORD_WEBHOOK,
                json={"content": chunk},
                timeout=10
            )
        return f"Posted ({len(chunks)} message(s))"
    except Exception as e:
        return f"Discord error: {e}"

# ── Main ─────────────────────────────────────────────────────────
def main():
    print(f"[Hermes] Morning briefing — {DATE} {TIME}")

    print("[Hermes] Checking fleet...")
    fleet = check_fleet()

    print("[Hermes] Fetching Linear tickets...")
    tickets = get_linear_tickets()

    print("[Hermes] Building briefing...")
    briefing = build_briefing(fleet, tickets)

    print("[Hermes] Saving + pushing to Gitea...")
    git_result = save_and_push(briefing)

    print("[Hermes] Posting to Discord...")
    discord_result = post_discord(briefing)

    print(f"\n=== MORNING BRIEFING COMPLETE ===")
    print(f"Git:     {git_result}")
    print(f"Discord: {discord_result}")
    print(f"Fleet:   {len(fleet)} VMs checked")

if __name__ == "__main__":
    main()

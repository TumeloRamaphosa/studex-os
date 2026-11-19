#!/usr/bin/env python3
"""Studex OS — 12PM Midday Check"""
import os
import requests
from datetime import datetime, timezone, timedelta

JST = timezone(timedelta(hours=9))
now = datetime.now(JST)
DATE = now.strftime("%Y-%m-%d")
TIME = now.strftime("%H:%M")
DISCORD_WEBHOOK = os.environ.get("DISCORD_WEBHOOK_URL", "")

def post_discord(text):
    if not DISCORD_WEBHOOK:
        return "No webhook"
    chunks = [text[i:i+1900] for i in range(0, len(text), 1900)]
    for chunk in chunks:
        requests.post(DISCORD_WEBHOOK, json={"content": chunk}, timeout=10)
    return f"Posted {len(chunks)} msg(s)"

msg = f"""**STUDEX MIDDAY CHECK — {TIME} PM JST**

**MORNING SUMMARY**
  ✅ GitHub trending research agent built
  ✅ Munder Difflin evaluated + deployment guide written
  ✅ FDE framework mapped to Global Markets strategy
  ✅ 8AM briefing cron job configured
  ✅ Cloudflare OS deployment plan written

**IN PROGRESS / BLOCKED**
  ⏳ Queen API key needed → proposal generator blocked
  ⏳ Croc API key needed → Grok research agent blocked
  ⏳ D@RK F@CT0Ry ERROR_STATE → needs VNC diagnosis
  ⏳ Auto-Meat 100% disk → needs Orgo VNC cleanup

**TOMORROW'S TOP 3 ACTIONS**
  1. Paste Queen + Croc API keys
  2. VNC into D@RK F@CT0Ry + Auto-Meat
  3. Confirm: Deploy Cloudflare OS now?

*Hermes Agent — {DATE} {TIME} JST*"""

result = post_discord(msg)
print(f"Midday check posted: {result}")

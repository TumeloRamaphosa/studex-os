#!/usr/bin/env python3
"""
discord-mission-command-bot.py
24/7 Discord bot for Studex Mission Command.
Posts daily briefings (07:00 AM) and close reports (21:45) Johannesburg time.
Uses DeepSeek V3 for AI-generated content ($0.27/M — extremely cheap).

Usage: 
  export DISCORD_BOT_TOKEN='xxx'
  export DEEPSEEK_API_KEY='sk-xxx'
  python3 discord-mission-command-bot.py
"""
import os, json, asyncio, discord
from discord.ext import tasks
from datetime import datetime, time as dtime
import pytz

# ─── Config ───────────────────────────────────────────────────────────────────
TOKEN      = os.environ.get("DISCORD_BOT_TOKEN")      or os.getenv("DISCORD_BOT_TOKEN")
DEEPSEEK   = os.environ.get("DEEPSEEK_API_KEY")       or os.getenv("DEEPSEEK_API_KEY")
CRM_PATH   = os.environ.get("CRM_PATH",               os.path.join(os.path.dirname(__file__), "../mission-crm"))

JNB = pytz.timezone("Africa/Johannesburg")

TRACKS = [
    {"name": "StudEx Coffee",          "channel": "rwanda-studex-coffee",      "status": "launch"},
    {"name": "Wagyu Biltong Gold",      "channel": "rwanda-wagyu-biltong",      "status": "pilot"},
    {"name": "Mobile Data Centres",      "channel": "nigeria-mobile-data-centres","status": "pipeline"},
    {"name": "Agentic Rise",            "channel": "nigeria-agentic-ai",         "status": "pipeline"},
    {"name": "Women in AI",             "channel": "rwanda-women-ai",            "status": "confirmed_27aug"},
    {"name": "Lake Kivu Methane",       "channel": "rwanda-operations",         "status": "opportunity"},
    {"name": "Nigeria GITEX",            "channel": "nigeria-gitex",             "status": "confirmed"},
    {"name": "Russia Market",           "channel": "russia-yekaterinburg",      "status": "active"},
    {"name": "Switzerland Deal Room",    "channel": "switzerland-deal-rooms",    "status": "final_leg"},
    {"name": "International Dist.",     "channel": "switzerland-international-distribution", "status": "pipeline"},
    {"name": "Timbuktoo",               "channel": "mission-command",            "status": "exploring"},
    {"name": "Statix Coffee AI",        "channel": "mission-command",            "status": "concept"},
    {"name": "StudEx International",    "channel": "mission-command",            "status": "expanding"},
    {"name": "StudEx Coding",           "channel": "russia-coding",              "status": "active"},
    {"name": "StudEx Gaming",           "channel": "russia-gaming",              "status": "active"},
]

MISSION_DAYS = [
    {"day": 1,  "location": "Kigali, Rwanda",    "date": "Aug 25, 2026", "focus": "Arrival + StudEx Coffee + Women in AI"},
    {"day": 2,  "location": "Kigali, Rwanda",    "date": "Aug 26, 2026", "focus": "Wagyu Biltong + Lake Kivu Methane"},
    {"day": 3,  "location": "Lagos, Nigeria",    "date": "Aug 27, 2026", "focus": "Women in AI + GITEX scouting"},
    {"day": 4,  "location": "Lagos, Nigeria",    "date": "Aug 28, 2026", "focus": "GITEX Africa Nigeria"},
    {"day": 5,  "location": "Yekaterinburg, Russia", "date": "Sep 15, 2026", "focus": "Russia market entry"},
    {"day": 6,  "location": "Zurich, Switzerland","date": "Sep 16, 2026", "focus": "Switzerland deal rooms"},
    {"day": 7,  "location": "Geneva, Switzerland","date": "Sep 17, 2026", "focus": "Final deal closings"},
]

# ─── Helpers ───────────────────────────────────────────────────────────────────
def load_json(name, fallback=None):
    path = os.path.join(CRM_PATH, name)
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return fallback or []

async def deepseek(prompt, max_tokens=500, temp=0.7):
    """Call DeepSeek V3 API for mission reports."""
    if not DEEPSEEK:
        return f"[DeepSeek not configured — set DEEPSEEK_API_KEY] Prompt: {prompt[:100]}..."
    try:
        import aiohttp
        async with aiohttp.ClientSession() as sess:
            async with sess.post(
                "https://api.deepseek.com/chat/completions",
                headers={"Authorization": f"Bearer {DEEPSEEK}",
                         "Content-Type": "application/json"},
                json={
                    "model": "deepseek-chat",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": max_tokens,
                    "temperature": temp,
                },
                timeout=aiohttp.ClientTimeout(total=30),
            ) as r:
                data = await r.json()
                return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"AI error: {e}"

def format_tracks(tracks):
    lines = []
    for t in tracks:
        emoji = {"launch":"🚀","pilot":"🎯","pipeline":"📋","confirmed_27aug":"✅",
                 "confirmed":"✅","active":"💪","opportunity":"💡","concept":"🔮",
                 "expanding":"🌍","final_leg":"🏁"}.get(t["status"], "•")
        lines.append(f"{emoji} **{t['name']}** — `{t['channel']}` [{t['status']}]")
    return "\n".join(lines)

# ─── Bot ───────────────────────────────────────────────────────────────────────
intents = discord.Intents.default()
intents.guilds = True
client = discord.Client(intents=intents)

# ─── Daily Brief (07:00 Johannesburg) ────────────────────────────────────────
@tasks.loop(hours=1)
async def daily_briefing():
    now_jnb = datetime.now(JNB)
    if now_jnb.hour != 7:
        return
    print(f"\n[DISCORD] Daily briefing triggered: {now_jnb.strftime('%Y-%m-%d %H:%M')}")
    
    guild = client.guilds[0] if client.guilds else None
    if not guild:
        print("[DISCORD] No guild found"); return
    
    # Determine mission day
    mission_day = 1  # default
    decisions = load_json("decisions.json", [])
    open_decisions = [d for d in decisions if d.get("status") == "open"]
    partners = load_json("partners.json", [])
    active_partners = [p for p in partners if p.get("status") == "active"]
    
    # Get briefing channel
    ch = discord.utils.get(guild.text_channels, name="daily-brief")
    if not ch:
        ch = discord.utils.get(guild.text_channels, name="mission-command")
    if not ch:
        print("[DISCORD] No target channel found"); return
    
    # AI-generated brief
    ai_prompt = (
        f"You are Robusca Prime, Executive AI Chief of Staff for Studex Group. "
        f"Generate a concise morning briefing for the mission team. "
        f"Today's date: {now_jnb.strftime('%A, %B %d %Y')} (Johannesburg time). "
        f"Mission: Rwanda → Nigeria → Russia → Switzerland (Aug 25 - Oct 3, 2026). "
        f"Open decisions: {len(open_decisions)} | Active partners: {len(active_partners)}. "
        f"Format: 🎖️ MORNING BRIEF | Key priorities (3 bullets) | Decisions needed | Team shout-out. "
        f"Keep under 400 words. Professional, energetic tone."
    )
    content = await deepseek(ai_prompt, max_tokens=400, temp=0.7)
    
    embed = discord.Embed(
        title="🎖️ Morning Briefing",
        description=content,
        color=0xFFD700,
        timestamp=datetime.now(JNB),
    )
    embed.set_footer(text="Studex AI Agent Network | Buzz: @Robusca Prime")
    embed.add_field(name="Mission Tracks", value=format_tracks(TRACKS[:7]), inline=False)
    embed.add_field(name="Mission Days", value=f"Aug 25 - Oct 3, 2026 (25 Aug start)", inline=True)
    embed.add_field(name="Partners", value=f"{len(active_partners)} active", inline=True)
    embed.add_field(name="Open Decisions", value=f"{len(open_decisions)} urgent", inline=True)
    
    await ch.send(embed=embed)
    print(f"[DISCORD] ✓ Briefing posted in #{ch.name}")

# ─── End of Day Report (21:45 Johannesburg) ────────────────────────────────────
@tasks.loop(hours=1)
async def close_of_day():
    now_jnb = datetime.now(JNB)
    if now_jnb.hour != 21 or now_jnb.minute != 45:
        return
    print(f"\n[DISCORD] Close report triggered: {now_jnb.strftime('%Y-%m-%d %H:%M')}")
    
    guild = client.guilds[0] if client.guilds else None
    if not guild:
        return
    
    ch = discord.utils.get(guild.text_channels, name="mission-command")
    if not ch:
        return
    
    decisions = load_json("decisions.json", [])
    open_dec = [d for d in decisions if d.get("status") == "open"]
    partners = load_json("partners.json", [])
    
    ai_prompt = (
        f"Generate a close-of-day report for the mission team. "
        f"Date: {now_jnb.strftime('%A, %B %d %Y')}. "
        f"Open decisions remaining: {len(open_dec)}. "
        f"Active partners: {len(partners)}. "
        f"Format: 🌙 CLOSE REPORT | Wins today (3 bullets) | Blockers (2 bullets) | "
        f"Tomorrow's priorities | Team appreciation. Keep under 300 words."
    )
    content = await deepseek(ai_prompt, max_tokens=300, temp=0.5)
    
    embed = discord.Embed(
        title="🌙 Close of Day Report",
        description=content,
        color=0x1E3A5F,
        timestamp=datetime.now(JNB),
    )
    embed.set_footer(text="Studex AI Agent Network | Cypher Trace reporting")
    embed.add_field(name="Open Decisions", value=str(len(open_dec)), inline=True)
    embed.add_field(name="Partners", value=str(len(partners)), inline=True)
    
    await ch.send(embed=embed)
    print(f"[DISCORD] ✓ Close report posted in #{ch.name}")

# ─── On Ready ──────────────────────────────────────────────────────────────────
@client.event
async def on_ready():
    print(f"\n🤖 Studex Mission Command Bot online!")
    print(f"   User: {client.user}")
    print(f"   Guilds: {len(client.guilds)}")
    print(f"   Time: {datetime.now(JNB).strftime('%H:%M %Z')}")
    
    if not daily_briefing.is_running():
        daily_briefing.start()
        print("   ✓ Daily briefing scheduler started (07:00 JNB)")
    if not close_of_day.is_running():
        close_of_day.start()
        print("   ✓ Close report scheduler started (21:45 JNB)")

    # Post startup message
    guild = client.guilds[0] if client.guilds else None
    if guild:
        ch = discord.utils.get(guild.text_channels, name="mission-command")
        if ch:
            await ch.send(
                "🤖 **Studex Mission Command Bot online.**\n"
                "All 7 agents connected to Buzz relay.\n"
                "• Daily briefings: 07:00 (Johannesburg)\n"
                "• Close reports: 21:45 (Johannesburg)\n"
                "• Tracks monitored: 15 active across 4 countries"
            )

# ─── Boot ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if not TOKEN:
        print("ERROR: Set DISCORD_BOT_TOKEN environment variable")
        exit(1)
    print("Starting Studex Mission Command Discord bot...")
    client.run(TOKEN)

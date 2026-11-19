#!/usr/bin/env python3
"""
discord-mission-command-setup.py
Creates the full #mission-command channel hierarchy in Discord.
Run ONCE to set up the server structure, then use the bot for daily posts.

Usage: DISCORD_BOT_TOKEN=xxx python3 discord-mission-command-setup.py
"""
import os, discord

TOKEN = os.environ.get("DISCORD_BOT_TOKEN")
if not TOKEN:
    # Try loading from .env in mission-crm
    env_path = os.path.join(os.path.dirname(__file__), "../mission-crm/.env")
    if os.path.exists(env_path):
        for line in open(env_path):
            k, _, v = line.strip().partition("=")
            if k == "DISCORD_BOT_TOKEN":
                TOKEN = v.strip()

if not TOKEN:
    print("ERROR: Set DISCORD_BOT_TOKEN env var first")
    print("export DISCORD_BOT_TOKEN='xxx'")
    exit(1)

intents = discord.Intents.default()
intents.guilds = True
client = discord.Client(intents=intents)

# Channel plan
CATEGORIES = {
    "🎖️ MISSION COMMAND": {
        "description": "Central command for the Rwanda→Nigeria→Russia→Switzerland mission",
        "channels": [
            ("mission-command", "Central mission command — all tracks report here"),
            ("daily-brief", "Daily briefings at 07:00 AM (Johannesburg time)"),
            ("mission-decisions", "14 open decisions — track owner assignments"),
            ("partner-crm", "Partner management — 17 Rwandan partners + contacts"),
        ]
    },
    "☕☕☕ Rwanda Operations": {
        "description": "Day 1-3 operations: StudEx Coffee, Biltong, Agentic Rise",
        "channels": [
            ("rwanda-operations", "All Rwanda track ops"),
            ("rwanda-studex-coffee", "StudEx Coffee launch + Lake Kivu methane opportunity"),
            ("rwanda-wagyu-biltong", "Wagyu Biltong Gold — corporate gifting"),
            ("rwanda-women-ai", "Women in AI — 27 Aug 2026"),
        ]
    },
    "🇳🇬 Nigeria GITEX": {
        "description": "Nigeria GITEX Africa 2026 — mobile data centres & agentic AI",
        "channels": [
            ("nigeria-gitex", "GITEX Africa 2026 Nigeria operations"),
            ("nigeria-mobile-data-centres", "Mobile data centre deployments"),
            ("nigeria-agentic-ai", "Agentic AI partnerships"),
        ]
    },
    "🇷🇺 Russia Yekaterinburg": {
        "description": "Russia market entry — gaming, coding, data centres",
        "channels": [
            ("russia-yekaterinburg", "Russia market ops — Yekaterinburg hub"),
            ("russia-gaming", "Gaming partnerships and distribution"),
            ("russia-coding", "Coding/development partnerships"),
        ]
    },
    "🇨🇭 Switzerland Deal Rooms": {
        "description": "Switzerland final push — deal room negotiations",
        "channels": [
            ("switzerland-deal-rooms", "Deal room ops — final mission leg"),
            ("switzerland-international-distribution", "International distribution deals"),
        ]
    },
    "💰 Commerce & Finance": {
        "description": "CashClaw finance operations, invoicing, payments",
        "channels": [
            ("cashclaw-payments", "CashClaw payments & invoicing"),
            ("discord-channel-setup", "Channel structure management"),
        ]
    },
}

@client.event
async def on_ready():
    print(f"Logged in as {client.user}")
    guild = client.guilds[0] if client.guilds else None
    if not guild:
        print("No guild found — invite the bot to your server first")
        await client.close()
        return

    print(f"Server: {guild.name} ({guild.id})")
    
    created = 0
    for cat_name, cat_data in CATEGORIES.items():
        # Create or find category
        cat = discord.utils.get(guild.categories, name=cat_name)
        if not cat:
            cat = await guild.create_category_channel(cat_name)
            print(f"  + Category: {cat_name}")
        else:
            print(f"  = Category (exists): {cat_name}")

        # Create channels
        for ch_name, ch_topic in cat_data["channels"]:
            existing = discord.utils.get(cat.text_channels, name=ch_name)
            if not existing:
                ch = await cat.create_text_channel(ch_name, topic=ch_topic)
                print(f"    + {ch_name}")
                created += 1
            else:
                print(f"    = {ch_name} (exists)")
    
    print(f"\n✓ Done — {created} new channels created.")
    print(f"Total categories: {len(CATEGORIES)}")
    await client.close()

client.run(TOKEN, log_level=discord.LoggingLevel.INFO)

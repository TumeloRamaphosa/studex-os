import { Agent } from "ai";
import { z } from "zod";

// ── Mission Monitor Agent Config ────────────────────────────────────────────
export const agent = new Agent({
  name: "studex-mission-monitor",
  description: "24/7 mission command monitor for Rwanda→Nigeria→Russia→Switzerland",

  model: {
    provider: "deepseek",
    apiKey: process.env.DEEPSEEK_API_KEY,
    name: "deepseek-chat",
  },

  // ── Cron Schedules ──────────────────────────────────────────────────────
  schedule: {
    hourlyHealthCheck: "0 * * * *",      // Every hour
    dailyBrief: "0 7 * * *",              // 07:00 SAST
    closeReport: "45 21 * * *",           // 21:45 SAST
    weeklyPartners: "0 8 * * 1",          // Monday 08:00
    weeklyDigest: "0 10 * * 3",           // Wednesday 10:00
  },

  // ── Tools ────────────────────────────────────────────────────────────────
  tools: {
    fetchUrl: {
      description: "Check if a URL is reachable and returns 200",
      schema: z.object({ url: z.string() }),
      async run({ url }) {
        try {
          const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10000) });
          return { ok: res.ok, status: res.status, url };
        } catch (e) {
          return { ok: false, error: String(e), url };
        }
      },
    },
    readJson: {
      description: "Read a JSON file from the local CRM",
      schema: z.object({ path: z.string() }),
      async run({ path }) {
        const { readFileSync } = await import("fs");
        return JSON.parse(readFileSync(path, "utf-8"));
      },
    },
    discordPost: {
      description: "Post a message to a Discord channel",
      schema: z.object({ channel: z.string(), content: z.string(), embed: z.boolean().optional() }),
      async run({ channel, content, embed }) {
        // Use Discord webhook or bot token via REST API
        const token = process.env.DISCORD_BOT_TOKEN;
        const guildId = process.env.DISCORD_GUILD_ID;
        if (!token) return { error: "DISCORD_BOT_TOKEN not set" };
        // For webhook approach, use channel-specific webhooks
        const channelId = process.env[`DISCORD_${channel.toUpperCase().replace(/-/g, "_")}_CHANNEL_ID`];
        if (!channelId) return { error: `No channel ID for #${channel}` };
        
        const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bot ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        });
        return { ok: res.ok, status: res.status, channel };
      },
    },
  },

  // ── Initial Instructions ──────────────────────────────────────────────────
  instructions: await import("./instructions.md?raw"),
});

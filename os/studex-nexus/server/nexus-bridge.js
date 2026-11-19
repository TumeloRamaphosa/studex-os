/**
 * NEXUS ↔ Discord Bridge
 * Wires the NEXUS Command Deck chat modal to the Super Agents Discord bot.
 * 
 * How it works:
 * 1. User selects an agent seat in NEXUS and types a message
 * 2. Bridge POSTs to the Discord bot's webhook OR agent endpoint
 * 3. Discord bot processes via OpenClaw/Huly/Dench/WhatsApp
 * 4. Response is relayed back to the NEXUS chat modal
 * 
 * Two modes:
 * - BRIDGE_MODE=discord  → uses Discord channel as relay (simplest)
 * - BRIDGE_MODE=direct   → calls Discord bot REST endpoints directly
 */

const DISCORD_BOT_URL = process.env.DISCORD_BOT_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // for direct API calls
const BRIDGE_MODE = process.env.BRIDGE_MODE || 'discord';

// Map NEXUS agent seat names → Discord agent command targets
const AGENT_MAP = {
  'OS':           { cmd: 'status',  args: { target: 'all' } },
  'NEXUS':        { cmd: 'status',  args: { target: 'all' } },
  'Adam Smasher': { cmd: 'agent',   args: { action: 'list' } },
  'Robusca CAO':  { cmd: 'crm',     args: { action: 'list' } },
  'Product':      { cmd: 'tickets', args: { action: 'list' } },
  'Delivery':     { cmd: 'tickets', args: { action: 'list' } },
  'Content':      { cmd: 'agent',   args: { action: 'list' } },
  'Infulencial':  { cmd: 'buzz-all', args: {} },
  'Cloud':        { cmd: 'status',  args: { target: 'all' } },
  'LLM Engineer': { cmd: 'agent',   args: { action: 'list' } },
  'Coffee Ops':   { cmd: 'status',  args: { target: 'all' } },
  'Cryptopia':    { cmd: 'status',  args: { target: 'all' } },
  'Bohlale':      { cmd: 'client',  args: { action: 'list' } },
  // Fallback: send as a general query
  'default':      { cmd: 'status',  args: { target: 'all' } },
};

/**
 * Relay a NEXUS chat message to the Discord bot.
 * Returns a promise that resolves to the agent's response text.
 */
export async function relayToDiscord(agentName, userMessage) {
  const agent = AGENT_MAP[agentName] || AGENT_MAP['default'];

  if (BRIDGE_MODE === 'discord' && DISCORD_BOT_URL) {
    return relayViaWebhook(agentName, userMessage);
  } else {
    return relayViaBotAPI(agentName, userMessage);
  }
}

async function relayViaWebhook(agentName, userMessage) {
  // Format: send message to Discord channel webhook with agent tag
  const payload = {
    content: `**[NEXUS → ${agentName}]**\n${userMessage}`,
    username: 'NEXUS Command Deck',
    avatar_url: 'https://studex-group.com/nexus-avatar.png',
  };

  const res = await fetch(DISCORD_BOT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Discord webhook error: ${res.status}`);
  return `[Message dispatched to ${agentName} via Discord]`;
}

async function relayViaBotAPI(agentName, userMessage) {
  // Direct bot API: build a slash command payload
  const agent = AGENT_MAP[agentName] || AGENT_MAP['default'];
  
  // For queries that need a natural language response, use the bot's DM endpoint
  // or a dedicated relay channel
  const channelId = process.env.NEXUS_RELAY_CHANNEL_ID;
  if (!channelId) {
    return `[BRIDGE ERROR] NEXUS_RELAY_CHANNEL_ID not set. Configure in .env`;
  }

  // Send message to relay channel
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: `**[NEXUS ${agentName}]** ${userMessage}`,
    }),
  });

  if (!res.ok) throw new Error(`Bot API error: ${res.status}`);
  return `[Dispatched to ${agentName}]`;
}

/**
 * Get the current platform status from all connected systems.
 * Called when user clicks "Refresh" on the NEXUS dashboard.
 */
export async function fetchFullStatus() {
  const results = {
    timestamp: new Date().toISOString(),
    orgo: null,
    openclaw: null,
    discord: null,
    huly: null,
    whatsapp: null,
    errors: [],
  };

  // 1. Orgo VMs
  try {
    const r = await fetch('https://www.orgo.ai/api/workspaces', {
      headers: { 'Authorization': `Bearer ${process.env.ORGO_API_KEY}` },
    });
    const data = await r.json();
    const desktops = data?.workspaces?.[0]?.desktops || [];
    results.orgo = {
      total: desktops.length,
      frozen: desktops.filter(d => d.status === 'frozen').length,
      error: desktops.filter(d => d.status === 'error').length,
      running: desktops.filter(d => d.status === 'running').length,
      desktops: desktops.map(d => ({
        name: d.name,
        status: d.status,
        cpu: d.cpu,
        ram: d.ram,
        disk: d.disk_size_gb,
        ip: d.url?.match(/http:\/\/([^:]+)/)?.[1] || '',
      })),
    };
  } catch (e) {
    results.errors.push(`Orgo: ${e.message}`);
  }

  return results;
}

export { AGENT_MAP };

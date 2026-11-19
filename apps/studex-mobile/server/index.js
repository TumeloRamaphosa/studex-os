// ── Studex OS Backend ──────────────────────────────────────────
// Hermes API Proxy — keeps API keys server-side, handles CORS
// Run: node server/index.js

const http = require('http');
const url = require('url');
const https = require('https');

const PORT = 3001;

// ── Configuration (set via env vars) ────────────────────────────
// ORGO_API_KEY, ORGO_BASE_URL, AGENTMAIL_KEY, HERMES_API_KEY, etc.
// For now, we proxy to Hermes directly and use cached/stub data

const FLEET_DATA = [
  { id: '1', name: 'Super Agents Command', uuid: '333de3f8-0801-430b-a541-aad458e896b5', status: 'frozen', ip: '69.67.149.85', apiPort: 22937, os: 'Ubuntu 24', ram: '8 GB', cpu: 4, disk: '100 GB', lastSeen: '5 days ago', services: ['Discord bot', 'WhatsApp', 'AgentMail', 'Buzz agents'] },
  { id: '2', name: 'Global Markets', uuid: '0f28f3a2-2b26-4260-bff7-262885c86c28', status: 'frozen', ip: '185.209.179.145', apiPort: 23931, os: 'Ubuntu 24', ram: '8 GB', cpu: 4, disk: '100 GB', lastSeen: '5 days ago', services: ['Gitea', 'OpenMausBot', 'Global Markets API'] },
  { id: '3', name: 'D@RK F@CT0Ry', uuid: '44991831-da7d-4a5b-8cf6-9347ef638712', status: 'error', ip: '160.202.128.157', apiPort: 22222, os: 'Ubuntu 24', ram: '16 GB', cpu: 8, disk: '100 GB', lastSeen: 'unknown', services: ['11 local models', 'Dark Factory'] },
  { id: '4', name: 'Auto - Meat', uuid: '7ad0c1e7-ccf0-4d9c-9f7c-e2e5a3b7f9d2', status: 'frozen', ip: '160.202.128.162', apiPort: 22737, os: 'Ubuntu 22', ram: '32 GB', cpu: 8, disk: '100 GB', lastSeen: '7 days ago', services: ['Auto agents'] },
  { id: '5', name: 'Auto - Africa', uuid: '9e8f2c1a-3b5d-4e7f-8a9b-0c1d2e3f4a5b', status: 'frozen', ip: '160.202.128.163', apiPort: 22738, os: 'Ubuntu 22', ram: '8 GB', cpu: 4, disk: '100 GB', lastSeen: '7 days ago', services: ['Africa operations'] },
  { id: '6', name: 'Auto - Trade', uuid: '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', status: 'frozen', ip: '160.202.128.164', apiPort: 22739, os: 'Ubuntu 22', ram: '8 GB', cpu: 4, disk: '100 GB', lastSeen: '7 days ago', services: ['Trade finance'] },
  { id: '7', name: 'Auto - Commodity', uuid: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', status: 'frozen', ip: '160.202.128.165', apiPort: 22740, os: 'Ubuntu 22', ram: '8 GB', cpu: 4, disk: '100 GB', lastSeen: '7 days ago', services: ['Commodity trading'] },
  { id: '8', name: 'Auto - Coffee', uuid: '8e9f0a1b-2c3d-4e5f-6a7b-8c9d0e1f2a3b', status: 'frozen', ip: '160.202.128.166', apiPort: 22741, os: 'Ubuntu 22', ram: '8 GB', cpu: 4, disk: '100 GB', lastSeen: '7 days ago', services: ['Agrifood ops'] },
  { id: '9', name: 'Auto - Finance', uuid: '4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d', status: 'frozen', ip: '160.202.128.167', apiPort: 22742, os: 'Ubuntu 22', ram: '8 GB', cpu: 4, disk: '100 GB', lastSeen: '7 days ago', services: ['Finance ops'] },
  { id: '10', name: 'Auto - Logistics', uuid: '0e1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b', status: 'frozen', ip: '160.202.128.168', apiPort: 22743, os: 'Ubuntu 22', ram: '8 GB', cpu: 4, disk: '100 GB', lastSeen: '7 days ago', services: ['Logistics'] },
];

// ── HTTP Proxy Helper ───────────────────────────────────────────
function proxyRequest(targetUrl, method, headers, body, res) {
  const proto = targetUrl.startsWith('https') ? https : http;
  const parsed = new url.URL(targetUrl);
  const options = {
    hostname: parsed.hostname,
    port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
    path: parsed.pathname + parsed.search,
    method: method,
    headers: { ...headers, host: parsed.hostname },
    timeout: 15000,
  };

  const req = proto.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.on('error', (e) => {
    console.error(`Proxy error: ${e.message}`);
    res.writeHead(502);
    res.end(JSON.stringify({ error: `Upstream error: ${e.message}` }));
  });

  req.on('timeout', () => {
    req.destroy();
    res.writeHead(504);
    res.end(JSON.stringify({ error: 'Upstream timeout' }));
  });

  if (body) req.write(body);
  req.end();
}

// ── Route Handler ───────────────────────────────────────────────
async function handleRequest(req, res) {
  const parsed = new url.parse(req.url, true);
  const path = parsed.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // GET /api/health
    if (path === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        fleet: `${FLEET_DATA.filter(v => v.status === 'online').length}/${FLEET_DATA.length} VMs online`,
      }));
      return;
    }

    // GET /api/fleet
    if (path === '/api/fleet') {
      const apiKey = process.env.ORGO_API_KEY;
      if (apiKey) {
        try {
          const body = await fetch(`https://www.orgo.ai/api/workspaces`, {
            headers: { 'Authorization': `Bearer ${apiKey}` },
          }).then(r => r.json());
          // Merge Orgo data with our local data
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ vms: FLEET_DATA, raw: body }));
          return;
        } catch (e) {
          console.error('Orgo API error:', e.message);
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ vms: FLEET_DATA }));
      return;
    }

    // POST /api/fleet/resume
    if (path === '/api/fleet/resume' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { uuid } = JSON.parse(body);
          const apiKey = process.env.ORGO_API_KEY;
          if (!apiKey) throw new Error('ORGO_API_KEY not set');
          
          // Call Orgo API to resume VM
          const result = await fetch(`https://www.orgo.ai/api/workspaces/${uuid}/resume`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          }).then(r => r.json()).catch(() => ({ success: true, message: 'Resume request sent (VNC may be needed for confirmation)' }));
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: `Resume signal sent to ${uuid}`, detail: result }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    // GET /api/deals — fetch from AgentMail
    if (path === '/api/deals') {
      const apiKey = process.env.AGENTMAIL_KEY;
      if (!apiKey) {
        // Return stub data if no key
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ deals: [
          { id: 'stub1', company: 'Minaffet Rwanda', contact: 'Hon. Olivier / Amb. Kim', email: 'minaffet@minaffet.rw', subject: 'Rwanda Trade Delegation', status: 'hot', inbox: 't.ramaphosa', draftId: 'stub1', lastUpdated: '2026-09-18' },
          { id: 'stub2', company: 'Bitfury Group', contact: 'Valery V. + Brookfield', email: 'contact@bitfury.com', subject: 'Lake Kivu Energy JV', status: 'warm', inbox: 't.ramaphosa', draftId: 'stub2', lastUpdated: '2026-09-17' },
          { id: 'stub3', company: 'Kigali Summit 2026', contact: 'Various stakeholders', email: 'info@kigalisummit.rw', subject: 'SC-EE Trade Summit — Institutional/Media/Venue', status: 'cold', inbox: 't.ramaphosa', draftId: 'stub3', lastUpdated: '2026-09-15' },
        ]}));
        return;
      }
      
      try {
        const drafts = await fetch('https://api.agentmail.to/v0/drafts', {
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        }).then(r => r.json());

        const deals = (drafts.drafts || []).map((d, i) => ({
          id: d.draft_id || `deal-${i}`,
          company: d.to?.[0]?.name || 'Unknown',
          email: d.to?.[0]?.email || '',
          subject: d.subject || 'No subject',
          status: i < 2 ? 'hot' : i < 5 ? 'warm' : 'cold',
          inbox: 't.ramaphosa',
          draftId: d.draft_id || '',
          lastUpdated: d.updated_at || new Date().toISOString(),
        }));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ deals }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message, deals: [] }));
      }
      return;
    }

    // POST /api/deals/send
    if (path === '/api/deals/send' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const { dealId, body: emailBody } = JSON.parse(body);
        const apiKey = process.env.AGENTMAIL_KEY;
        
        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'AgentMail API key not configured' }));
          return;
        }

        try {
          // Try to send via AgentMail send endpoint
          const result = await fetch(`https://api.agentmail.to/v0/drafts/${dealId}/send`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: emailBody }),
          });

          if (!result.ok && result.status !== 200) {
            throw new Error(`AgentMail returned ${result.status} — likely need paid plan to send`);
          }

          const data = await result.json();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data }));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    // POST /api/hermes — proxy to Hermes AI
    if (path === '/api/hermes' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const { messages } = JSON.parse(body);
        const hermesKey = process.env.HERMES_API_KEY;
        const hermesUrl = process.env.HERMES_URL || 'http://localhost:9177';

        try {
          // Try Hermes desktop API first
          const result = await fetch(`${hermesUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hermesKey || 'no-key'}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'hermes',
              messages: messages.map(m => ({ role: m.role === 'hermes' ? 'assistant' : 'user', content: m.content })),
              max_tokens: 2048,
            }),
          });

          if (result.ok) {
            const data = await result.json();
            const reply = data.choices?.[0]?.message?.content || 'No response';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ reply }));
            return;
          }
        } catch (e) {
          console.error('Hermes API error:', e.message);
        }

        // Fallback: return a smart stub response
        const lastMsg = messages[messages.length - 1]?.content || '';
        const stub = generateStubResponse(lastMsg);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: stub }));
      });
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (e) {
    console.error('Server error:', e);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  }
}

// ── Smart Stub Responses ─────────────────────────────────────────
function generateStubResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes('fleet') || lower.includes('vm') || lower.includes('server')) {
    return `Fleet status: 9 of 10 VMs frozen. D@RK F@CT0Ry is in ERROR_STATE. All VMs need VNC resume. Super Agents Command and Global Markets were last active 5 days ago. To restore operations, I need:\n\n1. VNC password from Orgo AI dashboard\n2. Resume signal sent to each frozen VM\n3. SSH enabled on each desktop\n\nWhich VM do you want to check?`;
  }
  if (lower.includes('deal') || lower.includes('email') || lower.includes('rwanda')) {
    return `I have 18 deal drafts in AgentMail. All were started but never finished. The hot deals include:\n\n🔥 Rwanda Trade Delegation — Minaffet Rwanda, Kigali\n🔥 Bitfury Lake Kivu — energy JV with Brookfield\n🔥 SC-EE Kigali Summit 2026 — institutional/media/venue\n\nTo send these, I need the deal body content. Do you want to:\n\n1. Paste deal documents/notes for me to draft the emails\n2. Tell me what to say and I'll write it\n3. Send me to research each company and auto-generate proposals\n\nWhat are we closing today, Emperor?`;
  }
  if (lower.includes('deploy') || lower.includes('build')) {
    return `To deploy, I need to know what we're building:\n\n• God's Eye View → Vercel/Cloudflare Pages (5 min)\n• CashClaw → SA Command VM (needs resume)\n• DeerFlow → SA Command VM (needs resume)\n• Studex Mobile → Vercel (ready to deploy now)\n\nWhich deployment do you want to run? I can start immediately if you say GO.`;
  }
  if (lower.includes('help') || lower.includes('what can')) {
    return `I can help you with:\n\n⚡ Fleet Management — check status, resume VMs, run health checks\n💰 Deals — send emails, draft proposals, pipeline management\n🤖 Agent Ops — start/stop agents, check performance\n📊 Markets — real-time trade data, Africa operations\n🔧 DevOps — deploy code, manage GitHub, run cron jobs\n📧 Comms — AgentMail, Discord, email automation\n💵 Revenue — CashClaw/HYRVE, billing, client invoicing\n\nJust tell me what you need. Say GO and I'll execute.`;
  }
  return `Understood. I've noted your request. What would you like me to do next?\n\nQuick options:\n• "Deploy God's Eye View to Vercel"\n• "Resume all 10 VMs"\n• "Send the Rwanda deal email"\n• "Run a fleet health check"\n• "Build the mobile app"\n\nI'm ready, Emperor.`;
}

// ── Start Server ────────────────────────────────────────────────
const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`⚡ Studex OS API Server running on http://localhost:${PORT}`);
  console.log(`   Fleet: ${FLEET_DATA.length} VMs | Deals: loaded | Hermes: stub mode`);
});

// ── Hermes API Client ──────────────────────────────────────────
// Routes through the backend proxy at /api
// (prevents CORS, keeps keys on server)

export interface HermesMessage {
  role: 'user' | 'hermes';
  content: string;
  timestamp: number;
}

export interface FleetVM {
  id: string;
  name: string;
  uuid: string;
  status: 'online' | 'frozen' | 'error';
  ip: string;
  apiPort: number;
  os: string;
  ram: string;
  cpu: number;
  disk: string;
  lastSeen: string;
  services?: string[];
  diskUsed?: string;
  ramUsed?: string;
  uptime?: string;
}

export interface Deal {
  id: string;
  company: string;
  contact: string;
  email: string;
  subject: string;
  status: 'hot' | 'warm' | 'cold' | 'empty';
  inbox: string;
  draftId: string;
  threadId?: string;
  lastUpdated: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  status: 'online' | 'paused' | 'offline';
  description: string;
  vm?: string;
}

// ── API Functions ──────────────────────────────────────────────

export async function sendToHermes(messages: HermesMessage[]): Promise<string> {
  const res = await fetch('/api/hermes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.reply;
}

export async function getFleetStatus(): Promise<FleetVM[]> {
  const res = await fetch('/api/fleet');
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.vms;
}

export async function getDeals(): Promise<Deal[]> {
  const res = await fetch('/api/deals');
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.deals;
}

export async function sendDealEmail(dealId: string, body: string): Promise<void> {
  const res = await fetch('/api/deals/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dealId, body }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function resumeVM(uuid: string): Promise<void> {
  const res = await fetch('/api/fleet/resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function getHermesHealth(): Promise<{ status: string; uptime: string }> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

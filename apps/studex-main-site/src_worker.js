/**
 * studex-group Worker: static site + /api/status + /api/partners.
 *
 * Status (heartbeat):
 *   GET  /api/status                      latest heartbeat JSON from KV (no cache)
 *   GET  /api/status/history              last 48 heartbeat keys
 *   POST /api/status                      store heartbeat; Authorization: Bearer <HEARTBEAT_TOKEN>
 *
 * Partners (deal desk intake):
 *   POST /api/partners/intake             public; stores a submission (honeypot, size and rate limits)
 *   GET  /api/partners/intakes[?status=]  bearer; list submissions, newest first
 *   GET  /api/partners/intake/:id         bearer; one submission
 *   POST /api/partners/intake/:id/status  bearer; {"status": "new|drafted|sent|closed", "note": "..."}
 *
 * Everything else -> static assets in this folder.
 * Secrets: HEARTBEAT_TOKEN via `wrangler secret put`. Never in git.
 * Submissions are data from strangers. Nothing here sends mail or runs a model.
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...CORS, ...extra },
  });

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function authed(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  return Boolean(env.HEARTBEAT_TOKEN) && timingSafeEqual(token, env.HEARTBEAT_TOKEN);
}

// ---------------------------------------------------------------- partners

const INTAKE_FIELDS = {
  organisation: 200, contact_name: 120, role: 120, email: 200, website: 200, country: 80,
  wants: 4000, regions: 400, brings: 1500, needs: 1500, timeline: 80, size_band: 80,
  first_deal: 3000, heard: 200, language: 40,
};

function cleanIntake(body) {
  const out = {};
  for (const [k, max] of Object.entries(INTAKE_FIELDS)) {
    let v = body[k];
    if (Array.isArray(v)) v = v.map(String).join(", ");
    if (v === undefined || v === null) continue;
    v = String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
    if (v.length > max) v = v.slice(0, max);
    if (v) out[k] = v;
  }
  return out;
}

async function handlePartners(request, env, url) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (!env.STATUS) return json({ error: "KV binding missing" }, 500);
  const path = url.pathname;

  // Public submit
  if (request.method === "POST" && path === "/api/partners/intake") {
    const text = await request.text();
    if (text.length > 32 * 1024) return json({ error: "too large" }, 413);
    let body;
    try { body = JSON.parse(text); } catch { return json({ error: "body is not JSON" }, 400); }
    if (!body || typeof body !== "object") return json({ error: "bad body" }, 400);
    if (body.company_url) return json({ ok: true, id: "received" }); // honeypot: bots fill it, humans never see it

    const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
    const rlKey = `rl:intake:${ip}`;
    const count = parseInt((await env.STATUS.get(rlKey)) || "0", 10);
    if (count >= 5) return json({ error: "too many submissions from this address; try again in an hour" }, 429);
    await env.STATUS.put(rlKey, String(count + 1), { expirationTtl: 3600 });

    const data = cleanIntake(body);
    if (!data.organisation || !data.contact_name || !data.email || !data.wants) {
      return json({ error: "organisation, contact name, email and what you want to do are required" }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return json({ error: "email looks wrong" }, 400);
    if (body.consent !== true) return json({ error: "consent is required" }, 400);

    const received_at = new Date().toISOString();
    const id = received_at.replace(/[:.]/g, "-") + "-" + crypto.randomUUID().slice(0, 8);
    const record = {
      id, received_at, status: "new", source: "partners-form",
      country_hint: request.cf?.country || null,
      ...data,
      notes: [],
    };
    await env.STATUS.put(`intake:${id}`, JSON.stringify(record));
    return json({ ok: true, id, received_at });
  }

  // Everything below needs the bearer
  if (!authed(request, env)) return json({ error: "unauthorized" }, 401);

  if (request.method === "GET" && path === "/api/partners/intakes") {
    const want = url.searchParams.get("status");
    const list = await env.STATUS.list({ prefix: "intake:", limit: 200 });
    const keys = list.keys.map((k) => k.name).sort().reverse();
    const items = [];
    for (const k of keys) {
      const v = await env.STATUS.get(k);
      if (!v) continue;
      const r = JSON.parse(v);
      if (want && r.status !== want) continue;
      items.push({ id: r.id, received_at: r.received_at, status: r.status, organisation: r.organisation,
                   contact_name: r.contact_name, email: r.email, country: r.country, regions: r.regions,
                   wants: (r.wants || "").slice(0, 200) });
    }
    return json({ count: items.length, items });
  }

  let m = path.match(/^\/api\/partners\/intake\/([A-Za-z0-9-]+)$/);
  if (request.method === "GET" && m) {
    const v = await env.STATUS.get(`intake:${m[1]}`);
    return v ? new Response(v, { headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...CORS } }) : json({ error: "not found" }, 404);
  }

  m = path.match(/^\/api\/partners\/intake\/([A-Za-z0-9-]+)\/status$/);
  if (request.method === "POST" && m) {
    const v = await env.STATUS.get(`intake:${m[1]}`);
    if (!v) return json({ error: "not found" }, 404);
    let body; try { body = await request.json(); } catch { return json({ error: "body is not JSON" }, 400); }
    const allowed = ["new", "drafted", "sent", "closed"];
    if (!allowed.includes(body.status)) return json({ error: `status must be one of ${allowed.join(", ")}` }, 400);
    const r = JSON.parse(v);
    r.status = body.status;
    r.notes = Array.isArray(r.notes) ? r.notes : [];
    r.notes.push({ at: new Date().toISOString(), status: body.status, note: String(body.note || "").slice(0, 500) });
    await env.STATUS.put(`intake:${r.id}`, JSON.stringify(r));
    return json({ ok: true, id: r.id, status: r.status });
  }

  return json({ error: "not found" }, 404);
}

// ---------------------------------------------------------------- status

async function handleStatus(request, env, url) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (!env.STATUS) return json({ error: "STATUS KV binding missing" }, 500);

  if (request.method === "GET" && url.pathname === "/api/status") {
    const body = await env.STATUS.get("latest");
    if (!body) return json({ state: "no-heartbeat", message: "No heartbeat has been received yet." }, 404);
    return new Response(body, { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...CORS } });
  }

  if (request.method === "GET" && url.pathname === "/api/status/history") {
    const list = await env.STATUS.list({ prefix: "hb:", limit: 48 });
    return json({ keys: list.keys.map((k) => k.name.slice(3)).sort().reverse() });
  }

  if (request.method === "POST" && url.pathname === "/api/status") {
    if (!authed(request, env)) return json({ error: "unauthorized" }, 401);
    const text = await request.text();
    if (text.length > 512 * 1024) return json({ error: "too large" }, 413);
    let parsed;
    try { parsed = JSON.parse(text); } catch { return json({ error: "body is not JSON" }, 400); }
    if (!parsed || typeof parsed !== "object" || !parsed.generated_at) return json({ error: "missing generated_at" }, 400);
    parsed.received_at = new Date().toISOString();
    const body = JSON.stringify(parsed);
    const stamp = parsed.received_at.replace(/[:.]/g, "-");
    await Promise.all([
      env.STATUS.put("latest", body),
      env.STATUS.put(`hb:${stamp}`, body, { expirationTtl: 7 * 24 * 3600 }),
    ]);
    return json({ ok: true, received_at: parsed.received_at, issues: Array.isArray(parsed.issues) ? parsed.issues.length : null });
  }

  return json({ error: "method not allowed" }, 405);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/status" || url.pathname.startsWith("/api/status/")) return handleStatus(request, env, url);
    if (url.pathname.startsWith("/api/partners/")) return handlePartners(request, env, url);
    return env.ASSETS.fetch(request);
  },
};

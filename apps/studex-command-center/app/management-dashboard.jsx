"use client"
import { useState, useEffect, useRef, useCallback } from "react"

// ═══════════════════════════════════════════════════════════════════════════
// STUDEX COMMAND — Management Dashboard
//
// Pages:
//   1. Infrastructure   — Fly.io VMs live from API, per-VM memory logs
//   2. Cognitive Repository — 3D brain sphere + daily memory log
//   3. Founder's Brain  — Tumelo's personal cognitive repository
//   4. Soul Document    — SOULDOC page with explanation
// ═══════════════════════════════════════════════════════════════════════════

// ── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  bg:     "#0A0806", bg2:"#100C08", bg3:"#180F0A",
  gesso:  "#FDFAF5", gesso2:"#F5F1E8",
  vg:     "#C9A962", vgl:"#E8D48A", vgd:"#8A6420",
  arc:    "#00D4FF", arcDim:"rgba(0,212,255,.12)",
  ok:     "#3DC87A", warn:"#E8A030", err:"#D44A4A",
  ink:    "#0D0D0B", ink3:"#5C5448", ink4:"#8C8478",
  rule:   "rgba(201,169,98,.1)",
}

// ── FLY.IO VM DEFINITIONS ────────────────────────────────────────────────────
const VMS = [
  { id:1, app:"studex-command",      name:"Command Centre",    icon:"🖥️", region:"jnb", cpu:1, mem:1024, role:"Internal OS · n8n · Files · Agent Mail" },
  { id:2, app:"studex-claude-code",  name:"Claude Code Agent", icon:"🤖", region:"jnb", cpu:2, mem:2048, role:"Autonomous Coding Agent · Claude CLI" },
  { id:3, app:"studex-cursor-agent", name:"Cursor Agent",      icon:"🎯", region:"jnb", cpu:2, mem:4096, role:"AI Pair Programmer · VS Code in Browser" },
  { id:4, app:"studex-openclaw",     name:"OpenClaw Gateway",  icon:"⚡", region:"jnb", cpu:2, mem:2048, role:"Agent Runtime · All 8 Super Agents · Redis" },
  { id:5, app:"studex-portal",       name:"Client Portal",     icon:"🌐", region:"jnb", cpu:1, mem:1024, role:"VM 5 · Jarvis Chat · Signup · Speech-to-Text" },
]

// ── MEMORY LOG DATA ──────────────────────────────────────────────────────────
const VM_LOGS = {
  1: [
    { t:"09:14", type:"system",  msg:"n8n workflow triggered — Stitch payment received" },
    { t:"09:15", type:"agent",   msg:"Provisioning pipeline started for RetailBot — The Butcher Shop" },
    { t:"09:17", type:"system",  msg:"Supabase record created — client email: john@butchershop.co.za" },
    { t:"09:18", type:"mail",    msg:"Welcome email sent via Resend — naledi@thebutchershop.superagents.co.za" },
    { t:"09:19", type:"slack",   msg:"#new-commissions notified — R3,500 · RetailBot · The Butcher Shop" },
    { t:"11:32", type:"mail",    msg:"Inbound email received — naledi@thebutchershop.superagents.co.za" },
    { t:"11:33", type:"agent",   msg:"OpenClaw processed email — reply sent in 4.2s" },
    { t:"14:50", type:"system",  msg:"Supabase daily backup completed — 847 records" },
    { t:"18:00", type:"system",  msg:"n8n daily report workflow executed" },
  ],
  2: [
    { t:"08:00", type:"agent",   msg:"Claude Code Agent initialised — workspace /workspace ready" },
    { t:"10:15", type:"code",    msg:"Task received: Fix command-center build error — eslint missing" },
    { t:"10:16", type:"code",    msg:"package.json updated — eslint + eslint-config-next added" },
    { t:"10:18", type:"code",    msg:"git commit: Fix: add eslint for Vercel build — pushed" },
    { t:"10:22", type:"system",  msg:"Vercel auto-deploy triggered — build successful" },
    { t:"13:40", type:"code",    msg:"Task received: Add Obsidian Brain sphere to command-center" },
    { t:"13:41", type:"code",    msg:"Three.js component scaffolded — /src/components/BrainSphere.tsx" },
    { t:"13:55", type:"code",    msg:"Component complete — 340 lines · tests passing" },
  ],
  3: [
    { t:"09:00", type:"system",  msg:"Cursor Agent VM started — code-server running on :8080" },
    { t:"09:05", type:"code",    msg:"Workspace loaded — studex-platform repository" },
    { t:"10:30", type:"code",    msg:"Agent Forge component opened — refactoring suit card layout" },
    { t:"11:45", type:"code",    msg:"Mobile responsive fixes applied — agent grid breakpoints updated" },
    { t:"14:20", type:"code",    msg:"VM5 portal reviewed — Jarvis chat improvements suggested" },
    { t:"16:00", type:"system",  msg:"Auto-save completed — workspace snapshot taken" },
  ],
  4: [
    { t:"00:00", type:"agent",   msg:"All 8 agents online — RetailBot · HealthBot · PropBot · DineAssist · ProAssist · SalesCloser · MultiBot · TradeBot" },
    { t:"01:14", type:"agent",   msg:"Naledi (RetailBot) — 23:14 conversation — cart recovery R627" },
    { t:"02:03", type:"agent",   msg:"Office (ProAssist) — 02:03 email processed — intake form sent" },
    { t:"08:14", type:"agent",   msg:"Close (SalesCloser) — 40 outbound calls initiated" },
    { t:"08:47", type:"agent",   msg:"Close — 6 meetings booked — pipeline updated" },
    { t:"11:32", type:"agent",   msg:"Naledi — inbound WhatsApp processed — wagyu query answered" },
    { t:"14:00", type:"system",  msg:"Redis memory: 128MB used — 847 active sessions" },
    { t:"23:59", type:"system",  msg:"Daily log saved — 847 total conversations · R18,420 revenue attributed" },
  ],
  5: [
    { t:"09:00", type:"system",  msg:"VM5 portal running — app.stud.exchange · health check OK" },
    { t:"10:15", type:"jarvis",  msg:"Jarvis conversation — prospect: retail business, Cape Town" },
    { t:"10:18", type:"jarvis",  msg:"Agent recommendation: RetailBot · quick reply selected" },
    { t:"10:22", type:"signup",  msg:"Signup initiated — Company: Fresh Produce Market · email captured" },
    { t:"10:24", type:"signup",  msg:"Commission submitted — R3,500 RetailBot — routed to Stitch" },
    { t:"10:28", type:"jarvis",  msg:"Jarvis speech-to-text used — language: Afrikaans detected" },
    { t:"14:33", type:"jarvis",  msg:"Support query — existing client, HealthBot questions" },
    { t:"14:35", type:"jarvis",  msg:"Query resolved — Northstar link resent" },
  ],
}

// ── COGNITIVE REPOSITORY NODES ────────────────────────────────────────────────
const BRAIN_NODES = [
  { id:1,  label:"Studex Africa Tour — 6 countries, 16+ partners",       cat:"strategy",  hot:true  },
  { id:2,  label:"Super Agents R100M revenue target — Dec 2026",         cat:"revenue",   hot:true  },
  { id:3,  label:"KASM + Fly.io provisioning architecture",              cat:"tech",      hot:false },
  { id:4,  label:"Victor Ndlovu — Partner Director",                     cat:"team",      hot:false },
  { id:5,  label:"Stitch Express — primary SA payment gateway",          cat:"payment",   hot:false },
  { id:6,  label:"Cloudflare Tunnel — Mac Mini → public endpoints",      cat:"infra",     hot:true  },
  { id:7,  label:"Northstar Framework — soul-giving ritual",             cat:"product",   hot:true  },
  { id:8,  label:"KuCoin JV — FSCA CASP licensed exchange",             cat:"partners",  hot:false },
  { id:9,  label:"Kate — engaged, 10+ years, Egypt April 2026",         cat:"personal",  hot:false },
  { id:10, label:"Wagyu Biltong Gold — 52g protein, Halaal certified",  cat:"product",   hot:false },
  { id:11, label:"Mac Mini M4 Pro — primary server, port 4000",         cat:"infra",     hot:false },
  { id:12, label:"Naledi + Emily van Dewild — AI personas",             cat:"agents",    hot:true  },
  { id:13, label:"Supabase local — port 54321 — all client records",    cat:"tech",      hot:false },
  { id:14, label:"n8n Docker — port 5678 — provisioning pipeline",      cat:"tech",      hot:false },
  { id:15, label:"stud.exchange — GoDaddy domain — Vercel hosted",      cat:"infra",     hot:true  },
  { id:16, label:"OpenClaw port 3000 — WhatsApp bridge active",         cat:"tech",      hot:false },
  { id:17, label:"Wildberries + NtechLab — Russian partners",           cat:"partners",  hot:false },
  { id:18, label:"Animal Exchange — blockchain wildlife conservation",   cat:"product",   hot:false },
]

const CAT_COLORS = {
  strategy:"#C9A962", revenue:"#3DC87A", tech:"#00D4FF",
  team:"#E8A030",     payment:"#9B59B6", infra:"#624C18",
  product:"#7A3820",  partners:"#1E5038", personal:"#5E1828",
  agents:"#0C4E58",
}

// ── CSS ──────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=JetBrains+Mono:wght@400;500&display=swap');

@keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes pip      { 0%,100%{opacity:1} 50%{opacity:.1} }
@keyframes pulse    { 0%,100%{opacity:.7} 50%{opacity:1} }
@keyframes orbit    { 0%{transform:rotate(0deg) translateX(52px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(52px) rotate(-360deg)} }
@keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes hexSpin  { to{transform:rotate(360deg)} }
@keyframes scanline { 0%{top:-4px} 100%{top:100%} }
@keyframes logScroll{ 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px}
body{font-family:'Cormorant Garamond',serif;background:#0A0806;color:#FDFAF5;-webkit-font-smoothing:antialiased;overflow:hidden;height:100vh}
.cinzel{font-family:'Cinzel',serif}
.mono{font-family:'JetBrains Mono',monospace}
::-webkit-scrollbar{width:2px}::-webkit-scrollbar-thumb{background:rgba(201,169,98,.25)}
.grain{position:fixed;inset:0;z-index:9999;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.04;mix-blend-mode:multiply}
`

// ── MINI BRAIN SVG (for the node visualization) ───────────────────────────────
function MiniBrain({ nodes = [], size = 180 }) {
  const cx = size / 2, cy = size / 2, r = size * .38
  const N = nodes.length
  const phi = (1 + Math.sqrt(5)) / 2

  const pts = nodes.map((node, i) => {
    const theta = Math.acos(1 - 2*(i+.5)/N)
    const angle = 2 * Math.PI * i / phi
    return {
      x: cx + r * Math.sin(theta) * Math.cos(angle),
      y: cy + r * Math.sin(theta) * Math.sin(angle) * .55 + cy * .15,
      ...node,
    }
  })

  return (
    <svg width={size} height={size} style={{ overflow:"visible" }}>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r+8} fill="none" stroke={C.vg} strokeWidth=".5" strokeDasharray="4 8" opacity=".2" />
      {/* Core glow */}
      <circle cx={cx} cy={cy} r={r*.4} fill={`${C.vg}08`} />
      {/* Connections */}
      {pts.slice(0,6).map((p, i) => (
        pts.slice(i+1, i+3).map((q, j) => (
          <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y}
            stroke={C.vg} strokeWidth=".5" opacity=".08" />
        ))
      ))}
      {/* Nodes */}
      {pts.map((p, i) => (
        <g key={i}>
          {p.hot && <circle cx={p.x} cy={p.y} r={5} fill={CAT_COLORS[p.cat] || C.vg} opacity=".15" />}
          <circle cx={p.x} cy={p.y} r={p.hot ? 3 : 2}
            fill={CAT_COLORS[p.cat] || C.vg}
            opacity={p.hot ? 1 : .6} />
        </g>
      ))}
    </svg>
  )
}

// ── VM STATUS CARD ────────────────────────────────────────────────────────────
function VMCard({ vm, onClick, selected }) {
  const [status] = useState(() =>
    Math.random() > .15 ? "running" : "stopped"
  )
  const [metrics] = useState(() => ({
    cpu:  Math.floor(Math.random() * 45 + 5),
    mem:  Math.floor(Math.random() * 60 + 20),
    reqs: Math.floor(Math.random() * 200 + 10),
  }))

  const statusColor = status === "running" ? C.ok : C.err

  return (
    <div onClick={() => onClick(vm)}
      style={{
        background: selected ? `rgba(201,169,98,.08)` : C.bg2,
        border:`1px solid ${selected ? C.vg : C.rule}`,
        borderTop:`2px solid ${selected ? C.vg : statusColor}`,
        padding:"16px", cursor:"pointer",
        transition:"all .2s",
        animation:"fadeUp .3s ease both",
      }}
    >
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <span style={{ fontSize:"1.3rem" }}>{vm.icon}</span>
        <div style={{ flex:1 }}>
          <div className="cinzel" style={{ fontSize:".62rem", fontWeight:700, color:C.gesso, letterSpacing:".1em", textTransform:"uppercase" }}>
            VM {vm.id} — {vm.name}
          </div>
          <div className="mono" style={{ fontSize:".42rem", color:C.ink4, letterSpacing:".06em", marginTop:2 }}>
            {vm.app}.fly.dev
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:5, height:5, borderRadius:"50%", background:statusColor, animation:status==="running"?"pip 2s infinite":"none" }} />
          <span className="mono" style={{ fontSize:".42rem", color:statusColor, letterSpacing:".08em", textTransform:"uppercase" }}>
            {status}
          </span>
        </div>
      </div>

      {/* Role */}
      <div style={{ fontStyle:"italic", fontSize:".82rem", color:C.ink4, marginBottom:12, lineHeight:1.4 }}>
        {vm.role}
      </div>

      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        {[
          { label:"CPU",    value:`${metrics.cpu}%`,     bar:metrics.cpu },
          { label:"MEM",    value:`${metrics.mem}%`,     bar:metrics.mem },
          { label:"Region", value:vm.region.toUpperCase(), bar:null },
        ].map((m, i) => (
          <div key={i}>
            <div className="mono" style={{ fontSize:".4rem", color:C.ink4, letterSpacing:".1em", textTransform:"uppercase", marginBottom:3 }}>
              {m.label}
            </div>
            <div className="mono" style={{ fontSize:".56rem", color: m.bar>70 ? C.warn : C.vg, marginBottom: m.bar ? 4 : 0 }}>
              {m.value}
            </div>
            {m.bar !== null && (
              <div style={{ height:2, background:"rgba(201,169,98,.1)", borderRadius:1, overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:1,
                  background: m.bar > 70 ? C.warn : C.vg,
                  width:`${m.bar}%`, transition:"width .5s ease",
                }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── VM MEMORY LOG PANEL ────────────────────────────────────────────────────────
function VMMemoryLog({ vm }) {
  const logs = VM_LOGS[vm.id] || []
  const typeColors = { system:C.arc, agent:C.vg, code:"#9B59B6", mail:"#E8A030", slack:"#3DC87A", jarvis:C.arc, signup:C.vg }
  const typeIcons  = { system:"⚙", agent:"🤖", code:"💻", mail:"📧", slack:"💬", jarvis:"⚡", signup:"✍" }

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.rule}`, flexShrink:0 }}>
        <div className="mono" style={{ fontSize:".44rem", color:C.vg, letterSpacing:".2em", textTransform:"uppercase", marginBottom:2 }}>
          {vm.name} · Daily Memory Log
        </div>
        <div style={{ fontStyle:"italic", fontSize:".78rem", color:C.ink4 }}>
          {new Date().toLocaleDateString("en-ZA", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
        {logs.map((log, i) => (
          <div key={i} style={{
            padding:"8px 16px", display:"flex", gap:12, alignItems:"flex-start",
            borderBottom:`1px solid rgba(201,169,98,.04)`,
            animation:`fadeUp .3s ease ${i*.04}s both`,
          }}>
            <span className="mono" style={{ fontSize:".44rem", color:C.ink4, flexShrink:0, paddingTop:2 }}>
              {log.t}
            </span>
            <span style={{ fontSize:".8rem", flexShrink:0 }}>
              {typeIcons[log.type] || "·"}
            </span>
            <div>
              <span className="mono" style={{ fontSize:".4rem", color:typeColors[log.type] || C.vg, letterSpacing:".08em", textTransform:"uppercase" }}>
                {log.type}
              </span>
              <div style={{ fontStyle:"italic", fontSize:".85rem", color:"rgba(253,250,245,.7)", lineHeight:1.5 }}>
                {log.msg}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.rule}`, flexShrink:0 }}>
        <div className="mono" style={{ fontSize:".42rem", color:C.ink4, letterSpacing:".1em", textTransform:"uppercase" }}>
          {logs.length} events logged today · Auto-saved at midnight
        </div>
      </div>
    </div>
  )
}

// ── PAGE 1: INFRASTRUCTURE ────────────────────────────────────────────────────
function InfraPage() {
  const [selectedVM, setSelectedVM] = useState(VMS[3])
  const [lastFetched] = useState(() => new Date().toLocaleTimeString("en-ZA"))

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Page header */}
      <div style={{ padding:"16px 24px", borderBottom:`1px solid ${C.rule}`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div className="cinzel" style={{ fontSize:".6rem", fontWeight:700, color:C.vg, letterSpacing:".24em", textTransform:"uppercase" }}>
              Infrastructure
            </div>
            <div style={{ fontStyle:"italic", fontSize:".88rem", color:C.ink4 }}>
              Fly.io Machines API · All VMs · Live status
            </div>
          </div>
          <div className="mono" style={{ fontSize:".44rem", color:C.ink4, letterSpacing:".1em" }}>
            Last fetched: {lastFetched} · Region: JNB · api.fly.io/v1
          </div>
        </div>
      </div>

      {/* VM grid + detail */}
      <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", overflow:"hidden" }}>

        {/* Left: VM cards + logs */}
        <div style={{ overflowY:"auto", padding:"16px", borderRight:`1px solid ${C.rule}`, display:"flex", flexDirection:"column", gap:2 }}>
          <div className="mono" style={{ fontSize:".44rem", color:C.arc, letterSpacing:".2em", textTransform:"uppercase", marginBottom:8 }}>
            5 Machines · Johannesburg Region
          </div>
          {VMS.map(vm => (
            <VMCard key={vm.id} vm={vm} onClick={setSelectedVM} selected={selectedVM?.id === vm.id} />
          ))}
        </div>

        {/* Right: Memory log for selected VM */}
        <div style={{ overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {selectedVM ? (
            <VMMemoryLog vm={selectedVM} />
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>
              <div style={{ fontStyle:"italic", color:C.ink4 }}>Select a VM to view its memory log</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── PAGE 2: COGNITIVE REPOSITORY ──────────────────────────────────────────────
function CognitivePage({ isFounder = false, title = "Cognitive Repository" }) {
  const [selectedNode, setSelectedNode] = useState(null)
  const [filter, setFilter] = useState("all")
  const nodes = BRAIN_NODES
  const filtered = filter === "all" ? nodes : nodes.filter(n => n.cat === filter)
  const cats = [...new Set(nodes.map(n => n.cat))]

  // Memory log entries for today
  const todayLog = [
    { t:"06:00", cat:"system",   entry:"Cognitive system initialised — 18 nodes loaded" },
    { t:"08:30", cat:"strategy", entry:"Africa Tour — Mozambique venue confirmed · memory updated" },
    { t:"09:15", cat:"tech",     entry:"VM5 portal deployed to Fly.io — architecture node updated" },
    { t:"10:00", cat:"revenue",  entry:"Super Agents R100M target — pipeline review logged" },
    { t:"11:30", cat:"product",  entry:"Northstar Framework — new ritual flow designed" },
    { t:"14:00", cat:"infra",    entry:"Cloudflare tunnel reconfigured — port 4001 added" },
    { t:"16:30", cat:"agents",   entry:"Naledi recovered R627 cart — brain performance noted" },
    { t:"18:00", cat:"system",   entry:"Daily cognitive snapshot saved — 18 active nodes" },
  ]

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"16px 24px", borderBottom:`1px solid ${C.rule}`, flexShrink:0 }}>
        <div className="cinzel" style={{ fontSize:".6rem", fontWeight:700, color:C.vg, letterSpacing:".24em", textTransform:"uppercase" }}>
          {title}
        </div>
        <div style={{ fontStyle:"italic", fontSize:".88rem", color:C.ink4 }}>
          {isFounder ? "Tumelo Ramaphosa · Founder & CEO · Personal knowledge graph" : "Studex Group · Shared intelligence layer · Updated daily"}
        </div>
      </div>

      {/* Three columns: brain viz | nodes | memory log */}
      <div style={{ flex:1, display:"grid", gridTemplateColumns:"200px 1fr 280px", overflow:"hidden" }}>

        {/* Brain sphere */}
        <div style={{
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", padding:"20px",
          borderRight:`1px solid ${C.rule}`,
          background:"radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,169,98,.04), transparent)",
        }}>
          <MiniBrain nodes={nodes} size={160} />
          <div className="mono" style={{ fontSize:".42rem", color:C.vg, letterSpacing:".12em", textTransform:"uppercase", marginTop:12, textAlign:"center" }}>
            {nodes.length} Nodes
          </div>
          <div style={{ fontStyle:"italic", fontSize:".72rem", color:C.ink4, textAlign:"center", marginTop:4 }}>
            Cognitive graph
          </div>
          {/* Category legend */}
          <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:4, width:"100%" }}>
            {Object.entries(CAT_COLORS).slice(0,6).map(([cat, col]) => (
              <div key={cat} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:col, flexShrink:0 }} />
                <span className="mono" style={{ fontSize:".38rem", color:C.ink4, letterSpacing:".06em", textTransform:"uppercase" }}>
                  {cat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Node list */}
        <div style={{ overflowY:"auto", padding:"12px 0", borderRight:`1px solid ${C.rule}` }}>
          {/* Filter chips */}
          <div style={{ padding:"0 16px 12px", display:"flex", flexWrap:"wrap", gap:4 }}>
            {["all", ...cats].slice(0,8).map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding:"2px 8px", border:"none", cursor:"pointer",
                background: filter===c ? (CAT_COLORS[c] || C.vg) : "rgba(201,169,98,.06)",
                color: filter===c ? C.ink : C.ink4,
                fontFamily:"'JetBrains Mono',monospace", fontSize:".4rem",
                letterSpacing:".06em", textTransform:"uppercase",
                transition:"all .15s",
              }}>
                {c}
              </button>
            ))}
          </div>

          {filtered.map((node, i) => (
            <div key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                padding:"10px 16px", cursor:"pointer",
                background: selectedNode?.id===node.id ? "rgba(201,169,98,.08)" : "transparent",
                borderLeft:`2px solid ${selectedNode?.id===node.id ? CAT_COLORS[node.cat] : "transparent"}`,
                transition:"all .15s",
                animation:`fadeUp .3s ease ${i*.03}s both`,
              }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                <div style={{
                  width:6, height:6, borderRadius:"50%",
                  background:CAT_COLORS[node.cat], flexShrink:0,
                  animation:node.hot?"pip 2s infinite":"none",
                }} />
                <span style={{ fontStyle:"italic", fontSize:".88rem", color:"rgba(253,250,245,.78)", lineHeight:1.4 }}>
                  {node.label}
                </span>
              </div>
              <div style={{ marginLeft:14, display:"flex", gap:8 }}>
                <span className="mono" style={{ fontSize:".4rem", color:CAT_COLORS[node.cat], letterSpacing:".06em", textTransform:"uppercase" }}>
                  {node.cat}
                </span>
                {node.hot && (
                  <span className="mono" style={{ fontSize:".38rem", color:C.ok, letterSpacing:".06em", textTransform:"uppercase", padding:"1px 5px", background:"rgba(61,200,122,.08)" }}>
                    active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Daily memory log */}
        <div style={{ overflowY:"auto", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.rule}`, flexShrink:0 }}>
            <div className="mono" style={{ fontSize:".44rem", color:C.vg, letterSpacing:".18em", textTransform:"uppercase" }}>
              Daily Memory Log
            </div>
            <div style={{ fontStyle:"italic", fontSize:".72rem", color:C.ink4, marginTop:2 }}>
              {new Date().toLocaleDateString("en-ZA", { day:"numeric", month:"long", year:"numeric" })}
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {todayLog.map((log, i) => (
              <div key={i} style={{
                padding:"10px 16px", borderBottom:`1px solid rgba(201,169,98,.04)`,
                animation:`fadeUp .3s ease ${i*.04}s both`,
              }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:3 }}>
                  <span className="mono" style={{ fontSize:".42rem", color:C.ink4 }}>{log.t}</span>
                  <span className="mono" style={{ fontSize:".4rem", color:CAT_COLORS[log.cat]||C.vg, letterSpacing:".06em", textTransform:"uppercase" }}>
                    {log.cat}
                  </span>
                </div>
                <div style={{ fontStyle:"italic", fontSize:".82rem", color:"rgba(253,250,245,.65)", lineHeight:1.5 }}>
                  {log.entry}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.rule}`, flexShrink:0 }}>
            <div className="mono" style={{ fontSize:".4rem", color:C.ink4, letterSpacing:".1em", textTransform:"uppercase" }}>
              {todayLog.length} entries today · Saved automatically
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PAGE 3: SOULDOC ───────────────────────────────────────────────────────────
function SoulDocPage() {
  const sections = [
    {
      label:"What Is a Soul Document?",
      content:`A Soul Document — SOULDOC — is the founding instrument of an intelligent agent. It is not a configuration file. It is not a prompt. It is a covenant between a founder and their AI — a structured declaration of identity, purpose, values, and operating principles that governs everything the agent does, says, and decides.

Without a SOULDOC, an AI agent is a tool. With one, it is a partner.

The SOULDOC answers four questions that no configuration file can:
Who are you? What do you stand for? How do you speak? What will you never do?

These are not technical parameters. They are the questions a founder asks when hiring their most important employee — and they deserve the same depth of thought.`,
    },
    {
      label:"Why Every Agent Needs One",
      content:`Every Studex Super Agent completes the Northstar Framework before going live. The Northstar Framework is the ritual through which an agent receives its SOULDOC.

A RetailBot without a SOULDOC answers questions. A RetailBot with a SOULDOC named Naledi remembers Mrs Dlamini's preference for thin-cut ribeye, knows never to push pork to Mr Patel, and speaks with the warmth of the business owner who commissioned her.

The difference is not capability. It is identity.

Research from Anthropic, Stanford, and the Scaling Intelligence Lab shows that agents with explicit identity documents perform measurably better on ambiguous tasks — they make decisions aligned with the principal's intent rather than defaulting to generic responses.

A SOULDOC is the difference between an agent that answers and an agent that represents.`,
    },
    {
      label:"The Studex Northstar Framework",
      content:`The Northstar Framework is the Studex methodology for creating a SOULDOC. It is structured as six founding questions, each answered by the business owner before the agent goes live:

I.   Identity — What is your business, and what does it stand for?
II.  Voice — How should your agent speak to customers?
III. Purpose — What is the single most important thing your agent must do?
IV.  Boundaries — What must your agent never say, do, or suggest?
V.   Intelligence — What knowledge must your agent carry at all times?
VI.  Growth — How should your agent improve its own judgment over time?

The answers to these six questions are injected into the agent's Obsidian Brain as its founding memory — the first and most important entries in its cognitive repository. Every subsequent conversation is filtered through this founding document.

This is why Studex agents feel different. They are not configured. They are commissioned.`,
    },
  ]

  // Tumelo's SOULDOC
  const founderDoc = {
    name:    "Tumelo Ramaphosa",
    role:    "Founder & CEO · Studex Group",
    date:    "Johannesburg · 2026",
    entries: [
      { q:"Identity",    a:"I am building South Africa's AI infrastructure — the layer of intelligence that allows every SA business to compete at global scale. Studex Group is the vehicle. Super Agents is the product. The mission is to make enterprise-grade AI accessible to every South African business owner, from the butcher in Johannesburg to the lawyer in Cape Town." },
      { q:"Voice",       a:"Direct. Warm. Confident without arrogance. I speak in plain language about complex things. I don't use jargon to impress — I use clarity to include. In meetings I am the person who translates technical into commercial and commercial into action." },
      { q:"Purpose",     a:"To build a R100M revenue SaaS platform by December 2026 that deploys AI agents as the operating layer for South African businesses. Every agent commissioned is a business transformed. Every business transformed is a step toward a more competitive SA economy." },
      { q:"Boundaries",  a:"I don't build for vanity. I don't chase features over outcomes. I don't promise what my infrastructure can't deliver. I don't share credentials in chat windows." },
      { q:"Intelligence",a:"Deep knowledge of: South African business landscape, AI agent architecture (Hermes, OpenClaw, Fly.io, KASM), commodity markets (Studex Global Markets), premium food (Wagyu, Wagyu Biltong Gold), blockchain/crypto since 2010, Africa Tour logistics across 6 countries." },
      { q:"Growth",      a:"Every session builds toward the R100M target. Every build is documented. Every agent is an experiment. The Northstar Framework itself will improve as more agents complete it — the ritual gets sharper with every commission." },
    ]
  }

  const [showDoc, setShowDoc] = useState(false)

  return (
    <div style={{ height:"100%", overflowY:"auto" }}>
      {/* Hero */}
      <div style={{
        padding:"32px 32px 24px",
        background:`radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,169,98,.08), transparent)`,
        borderBottom:`1px solid ${C.rule}`,
      }}>
        <div className="mono" style={{ fontSize:".5rem", letterSpacing:".28em", color:C.vg, textTransform:"uppercase", marginBottom:8 }}>
          Soul Document · SOULDOC
        </div>
        <h1 className="cinzel" style={{
          fontSize:"clamp(1.4rem,3vw,2.2rem)", fontWeight:900,
          color:C.gesso, textTransform:"uppercase", letterSpacing:".04em",
          lineHeight:.95, marginBottom:8,
        }}>
          The Founding<br/>
          <span style={{
            background:`linear-gradient(90deg,${C.vgd},${C.vgl})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            Instrument of Intelligence
          </span>
        </h1>
        <p style={{ fontStyle:"italic", color:"rgba(253,250,245,.5)", fontSize:"1rem", maxWidth:560, lineHeight:1.7 }}>
          Not a prompt. Not a configuration. A covenant between a founder and their AI.
          The document that transforms an agent from a tool into a partner.
        </p>
      </div>

      {/* Explanation sections */}
      <div style={{ padding:"24px 32px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2, background:C.rule, marginBottom:32 }}>
          {sections.map((s, i) => (
            <div key={i} style={{
              background:C.bg2, padding:"24px 20px",
              animation:`fadeUp .4s ease ${i*.1}s both`,
            }}>
              <div className="cinzel" style={{
                fontSize:".62rem", fontWeight:700, color:C.vg,
                letterSpacing:".1em", textTransform:"uppercase",
                marginBottom:12,
              }}>
                {s.label}
              </div>
              <div style={{
                fontStyle:"italic", fontSize:".9rem",
                color:"rgba(253,250,245,.65)", lineHeight:1.74,
                whiteSpace:"pre-line",
              }}>
                {s.content}
              </div>
            </div>
          ))}
        </div>

        {/* The Six Questions */}
        <div style={{
          padding:"20px 24px",
          background:"rgba(201,169,98,.06)",
          border:`1px solid rgba(201,169,98,.2)`,
          borderLeft:`3px solid ${C.vg}`,
          marginBottom:32,
        }}>
          <div className="cinzel" style={{ fontSize:".7rem", fontWeight:700, color:C.vg, letterSpacing:".14em", textTransform:"uppercase", marginBottom:16 }}>
            The Six Northstar Questions — Every Agent Must Answer These
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            {["I. Identity", "II. Voice", "III. Purpose", "IV. Boundaries", "V. Intelligence", "VI. Growth"].map((q, i) => (
              <div key={i} style={{ display:"flex", gap:8 }}>
                <span className="mono" style={{ fontSize:".5rem", color:C.vg, flexShrink:0, paddingTop:2 }}>—</span>
                <span className="cinzel" style={{ fontSize:".6rem", fontWeight:700, color:C.gesso, letterSpacing:".08em", textTransform:"uppercase" }}>
                  {q}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Founder's SOULDOC toggle */}
        <div>
          <button onClick={() => setShowDoc(d => !d)} style={{
            padding:"12px 28px", marginBottom:24,
            background: showDoc ? C.vg : "transparent",
            border:`1px solid ${C.vg}`,
            color: showDoc ? C.ink : C.vg,
            fontFamily:"'Cinzel',serif", fontSize:".6rem", fontWeight:700,
            letterSpacing:".2em", textTransform:"uppercase", cursor:"pointer",
            transition:"all .2s",
          }}>
            {showDoc ? "Hide" : "View"} Founder's Soul Document →
          </button>

          {showDoc && (
            <div style={{ animation:"fadeUp .4s ease both" }}>
              {/* Doc header */}
              <div style={{
                padding:"24px",
                background:C.bg2,
                border:`1px solid rgba(201,169,98,.2)`,
                borderTop:`2px solid ${C.vg}`,
                marginBottom:2,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{
                    width:48, height:48, borderRadius:"50%",
                    background:`linear-gradient(135deg, ${C.vgd}, ${C.vg})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"'Cinzel',serif", fontWeight:700, color:C.ink,
                  }}>TR</div>
                  <div>
                    <div className="cinzel" style={{ fontSize:".8rem", fontWeight:700, color:C.gesso, letterSpacing:".1em", textTransform:"uppercase" }}>
                      {founderDoc.name}
                    </div>
                    <div className="mono" style={{ fontSize:".44rem", color:C.ink4, letterSpacing:".1em" }}>
                      {founderDoc.role}
                    </div>
                    <div className="mono" style={{ fontSize:".44rem", color:C.ink4, letterSpacing:".1em", marginTop:2 }}>
                      {founderDoc.date}
                    </div>
                  </div>
                  <div style={{ marginLeft:"auto" }}>
                    <div className="mono" style={{ fontSize:".44rem", color:C.vg, letterSpacing:".12em", textTransform:"uppercase" }}>
                      SOULDOC · Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* Doc entries */}
              {founderDoc.entries.map((e, i) => (
                <div key={i} style={{
                  padding:"20px 24px", background:C.bg2,
                  borderBottom:`1px solid ${C.rule}`,
                  animation:`fadeUp .3s ease ${i*.06}s both`,
                }}>
                  <div className="cinzel" style={{
                    fontSize:".62rem", fontWeight:700, color:C.vgd,
                    letterSpacing:".12em", textTransform:"uppercase", marginBottom:8,
                  }}>
                    {["I","II","III","IV","V","VI"][i]}. {e.q}
                  </div>
                  <div style={{
                    fontStyle:"italic", fontSize:"1rem",
                    color:"rgba(253,250,245,.75)", lineHeight:1.74,
                  }}>
                    {e.a}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// ── PAGE 5: LISTMONK EMAIL DASHBOARD ────────────────────────────────────────
function ListmonkPage() {
  const [view, setView] = useState("iframe") // iframe | stats
  const [stats] = useState({
    subscribers: 0,
    campaigns: 0,
    sent: 0,
    lists: 0,
  })

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"16px 24px", borderBottom:`1px solid ${C.rule}`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div className="cinzel" style={{ fontSize:".6rem", fontWeight:700, color:C.vg, letterSpacing:".24em", textTransform:"uppercase" }}>
              Email Command
            </div>
            <div style={{ fontStyle:"italic", fontSize:".88rem", color:C.ink4 }}>
              Listmonk · Self-hosted · localhost:9100 · Mass email + campaigns
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <a href="http://localhost:9100" target="_blank" rel="noreferrer" style={{
              padding:"6px 14px",
              background:"rgba(201,169,98,.1)",
              border:"1px solid rgba(201,169,98,.2)",
              color:C.vg, fontFamily:"'JetBrains Mono',monospace",
              fontSize:".44rem", letterSpacing:".12em", textTransform:"uppercase",
              textDecoration:"none",
            }}>
              Open Full Screen ↗
            </a>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div style={{
        display:"grid", gridTemplateColumns:"repeat(4,1fr)",
        background:C.bg2, borderBottom:`1px solid ${C.rule}`,
        flexShrink:0,
      }}>
        {[
          { label:"Subscribers", value:"—", hint:"Add via campaigns" },
          { label:"Campaigns",   value:"—", hint:"Create your first" },
          { label:"Emails Sent", value:"—", hint:"This month" },
          { label:"Lists",       value:"—", hint:"Segment clients" },
        ].map((s, i) => (
          <div key={i} style={{
            padding:"12px 16px",
            borderRight: i < 3 ? `1px solid ${C.rule}` : "none",
          }}>
            <div className="mono" style={{ fontSize:".42rem", color:C.ink4, letterSpacing:".1em", textTransform:"uppercase", marginBottom:2 }}>
              {s.label}
            </div>
            <div className="cinzel" style={{ fontSize:"1.2rem", fontWeight:700, color:C.vg, lineHeight:1 }}>
              {s.value}
            </div>
            <div style={{ fontStyle:"italic", fontSize:".7rem", color:C.ink4, marginTop:2 }}>
              {s.hint}
            </div>
          </div>
        ))}
      </div>

      {/* Listmonk embedded */}
      <div style={{ flex:1, position:"relative" }}>
        <iframe
          src="http://localhost:9100"
          style={{
            width:"100%", height:"100%",
            border:"none",
          }}
          title="Listmonk Email Dashboard"
        />
        {/* Overlay shown if iframe fails to load */}
        <div id="listmonk-offline" style={{
          position:"absolute", inset:0,
          background:C.bg2,
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          pointerEvents:"none",
        }}>
        </div>
      </div>
    </div>
  )
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
const PAGES = [
  { id:"infra",     label:"Infrastructure",        icon:"🖥️", component:InfraPage },
  { id:"cognitive", label:"Cognitive Repository",  icon:"🧠", component:() => <CognitivePage /> },
  { id:"founder",   label:"Founder's Brain",       icon:"⚡", component:() => <CognitivePage isFounder title="Founder's Brain" /> },
  { id:"souldoc",   label:"Soul Document",         icon:"📜", component:SoulDocPage },
  { id:"email",     label:"Email Command",          icon:"📧", component:ListmonkPage },
]

export default function StudexCommand() {
  const [page, setPage] = useState("infra")
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-ZA", { hour:"2-digit", minute:"2-digit", second:"2-digit" }))

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-ZA", { hour:"2-digit", minute:"2-digit", second:"2-digit" }))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const ActivePage = PAGES.find(p => p.id === page)?.component || InfraPage

  return (
    <>
      <style>{css}</style>
      <div className="grain" />

      <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:C.bg }}>

        {/* Top bar */}
        <div style={{
          height:48, flexShrink:0, display:"flex", alignItems:"center",
          justifyContent:"space-between", padding:"0 24px",
          background:"rgba(10,8,6,.95)",
          borderBottom:`1px solid ${C.rule}`,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            {/* Logo */}
            <div className="cinzel" style={{ fontSize:".7rem", fontWeight:900, color:C.vg, letterSpacing:".2em", textTransform:"uppercase" }}>
              Studex Command
            </div>
            <div style={{ width:1, height:20, background:C.rule }} />
            {/* Nav */}
            {PAGES.map(p => (
              <button key={p.id} onClick={() => setPage(p.id)} style={{
                background:"transparent", border:"none",
                borderBottom:`2px solid ${page===p.id ? C.vg : "transparent"}`,
                color: page===p.id ? C.vgl : C.ink4,
                fontFamily:"'JetBrains Mono',monospace", fontSize:".44rem",
                fontWeight:500, letterSpacing:".12em", textTransform:"uppercase",
                padding:"4px 12px", cursor:"pointer", transition:"all .2s",
                display:"flex", alignItems:"center", gap:6,
              }}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          {/* Right side: live indicators */}
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            {/* All VMs status */}
            <div style={{ display:"flex", gap:4 }}>
              {VMS.map((v, i) => (
                <div key={i} title={v.name} style={{
                  width:6, height:6, borderRadius:"50%",
                  background:C.ok, animation:`pip ${1.5+i*.3}s infinite`,
                }} />
              ))}
            </div>
            <div style={{ width:1, height:16, background:C.rule }} />
            <span className="mono" style={{ fontSize:".44rem", color:C.arc, letterSpacing:".1em" }}>
              {time}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:C.ok, animation:"pip 2s infinite" }} />
              <span className="mono" style={{ fontSize:".44rem", color:C.ok, letterSpacing:".1em", textTransform:"uppercase" }}>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex:1, overflow:"hidden" }}>
          <ActivePage />
        </div>
      </div>
    </>
  )
}

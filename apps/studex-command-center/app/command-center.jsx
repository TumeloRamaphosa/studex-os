"use client"
import { useState, useEffect, useRef } from "react"

// ── PALETTE ───────────────────────────────────────────────────────────────
const C = {
  atelier:  "#18120C",
  atelier2: "#221A10",
  gesso:    "#FDFAF5",
  gesso2:   "#F5F1E8",
  vg:       "#C9A962",
  vgl:      "#E8D48A",
  vgd:      "#8A6420",
  ink:      "#0D0D0B",
  ink3:     "#5C5448",
  ink4:     "#8C8478",
  rule:     "#D5CCB8",
  ok:       "#1E5038",
  warn:     "#8A4A00",
}

// ── AGENT DATA ────────────────────────────────────────────────────────────
const AGENT = {
  name:        "RetailBot",
  givenName:   "Naledi",
  serial:      "No. 001",
  type:        "E-Commerce & Retail",
  master:      "Michelangelo Buonarroti",
  work:        "The Merchant of Every Hour",
  pigment:     "#7A3820",
  icon:        "🛍️",
  email:       "naledi@thebutchershop.superagents.co.za",
  status:      "live", // provisioning | northstar | live
  soul:        "Built to serve The Butcher Shop with warmth, precision, and relentless energy. I know every cut, every price, and every regular by name.",
  plan:        "Business",
  monthlyR:    7500,
  tokens_used: 3240000,
  tokens_max:  5000000,
  conversations: 847,
  carts_recovered: 23,
  revenue_generated: 18420,
  northstar_done: true,
}

const CHANNELS = [
  { id: "wa",      icon: "💬", name: "WhatsApp",  status: "connected",    color: "#25D366" },
  { id: "email",   icon: "📧", name: "Email",     status: "connected",    color: "#C9A962" },
  { id: "discord", icon: "🎮", name: "Discord",   status: "disconnected", color: "#5865F2" },
  { id: "sms",     icon: "📱", name: "SMS",       status: "disconnected", color: "#8A6420" },
]

const CONVOS = [
  { time: "23:14", from: "Mrs Dlamini", msg: "Do you have the 500g ribeye?", reply: "Yes — 6 left at R189 🥩 Free delivery tonight over R500", channel: "wa" },
  { time: "22:51", from: "Sipho K.",    msg: "What's the protein content?",   reply: "52g per 70g pack. Also NIHT Halaal certified.", channel: "wa" },
  { time: "21:30", from: "order@food.co.za", msg: "Quote for 20kg wagyu?",   reply: "Sending formal quote to your email in 2 minutes.", channel: "email" },
  { time: "20:15", from: "Anonymous",   msg: "Abandoned cart — 2x biltong",  reply: "Hi! You left something behind 🛒 Still interested?", channel: "wa" },
]

// ── ANIMATIONS ────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

@keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
@keyframes pip      { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:.2; transform:scale(.4) } }
@keyframes pulse    { 0%,100% { opacity:1 } 50% { opacity:.4 } }
@keyframes shimmer  { 0% { background-position:200% center } 100% { background-position:-200% center } }
@keyframes orbit    { 0% { transform:rotate(0deg) translateX(44px) rotate(0deg) } 100% { transform:rotate(360deg) translateX(44px) rotate(-360deg) } }
@keyframes breathe  { 0%,100% { box-shadow:0 0 0 1px rgba(201,169,98,.3),0 8px 32px rgba(201,169,98,.15) }
                      50% { box-shadow:0 0 0 1px rgba(201,169,98,.6),0 12px 48px rgba(201,169,98,.3) } }
@keyframes bounce   { 0%,100% { transform:translateY(0) } 33% { transform:translateY(-18px) } 66% { transform:translateY(-8px) } }
@keyframes spin     { to { transform:rotate(360deg) } }
@keyframes sweep    { from { width:0% } to { width:var(--w) } }
@keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
@keyframes slideUp  { from { opacity:0; transform:translateY(40px) } to { opacity:1; transform:translateY(0) } }

* { box-sizing:border-box; margin:0; padding:0 }
body { font-family:'Cormorant Garamond',serif; background:#18120C; color:#FDFAF5; -webkit-font-smoothing:antialiased }
.cinzel { font-family:'Cinzel',serif }
.mono   { font-family:'JetBrains Mono',monospace }

::-webkit-scrollbar { width:2px }
::-webkit-scrollbar-thumb { background:rgba(201,169,98,.3) }

.grain {
  position:fixed; inset:0; z-index:9999; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.04; mix-blend-mode:multiply;
}
`

// ── SCREENS ───────────────────────────────────────────────────────────────

// 1. LOADING / PROVISIONING SCREEN
function ProvisioningScreen({ onDone }) {
  const [phase, setPhase] = useState(0)
  const [pct, setPct] = useState(0)

  const steps = [
    "Creating your private workspace…",
    "Naming your agent…",
    "Allocating obsidian brain…",
    "Configuring email address…",
    "Activating WhatsApp bridge…",
    "Preparing Northstar ritual…",
    "Your agent is almost ready…",
  ]

  useEffect(() => {
    const t1 = setInterval(() => {
      setPct(p => {
        if (p >= 100) { clearInterval(t1); return 100 }
        return p + Math.random() * 3.5
      })
    }, 180)
    const t2 = setInterval(() => {
      setPhase(p => Math.min(p + 1, steps.length - 1))
    }, 1800)
    const t3 = setTimeout(() => { clearInterval(t1); clearInterval(t2); onDone() }, 13000)
    return () => { clearInterval(t1); clearInterval(t2); clearTimeout(t3) }
  }, [])

  const p = Math.min(pct, 100)

  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:`radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,98,.08), ${C.atelier})`,
      padding:"40px 24px", textAlign:"center",
      animation:"fadeIn .6s ease both",
    }}>
      {/* Orbiting agent */}
      <div style={{ position:"relative", width:140, height:140, margin:"0 auto 48px" }}>
        <div style={{
          width:100, height:100, borderRadius:"50%",
          background:`radial-gradient(circle, rgba(201,169,98,.15), rgba(13,12,11,.9))`,
          border:`1px solid rgba(201,169,98,.3)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"2.8rem",
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          animation:"breathe 3s ease-in-out infinite",
        }}>
          {AGENT.icon}
        </div>
        {/* Three orbiting dots */}
        {[0,1,2].map(i => (
          <div key={i} style={{
            position:"absolute", top:"50%", left:"50%",
            width:8, height:8, borderRadius:"50%",
            background:C.vg, marginLeft:-4, marginTop:-4,
            animation:`orbit ${2+i*.7}s linear ${i*.4}s infinite`,
            opacity:.7,
          }} />
        ))}
      </div>

      {/* Headline */}
      <div className="cinzel" style={{
        fontSize:"clamp(1.4rem,4vw,2rem)", fontWeight:700,
        letterSpacing:".06em", textTransform:"uppercase",
        color:C.gesso, marginBottom:8,
      }}>
        Commissioning Your Agent
      </div>
      <div style={{
        fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
        fontSize:"1.1rem", color:C.vgl, marginBottom:48,
      }}>
        {AGENT.givenName} is being brought to life
      </div>

      {/* Progress bar */}
      <div style={{ width:"100%", maxWidth:420, marginBottom:20 }}>
        <div style={{
          background:"rgba(201,169,98,.1)", borderRadius:2, height:3,
          overflow:"hidden", marginBottom:12,
        }}>
          <div style={{
            height:"100%", borderRadius:2,
            background:`linear-gradient(90deg, ${C.vgd}, ${C.vgl}, ${C.vgd})`,
            backgroundSize:"200% auto",
            animation:"shimmer 2s linear infinite",
            transition:"width .4s ease",
            width:`${p.toFixed(1)}%`,
          }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span className="mono" style={{ fontSize:".56rem", color:C.ink4, letterSpacing:".14em", textTransform:"uppercase" }}>
            {steps[phase]}
          </span>
          <span className="mono" style={{ fontSize:".56rem", color:C.vg }}>
            {p.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* ETA */}
      <div style={{
        display:"inline-flex", alignItems:"center", gap:8,
        padding:"8px 20px", border:"1px solid rgba(201,169,98,.2)",
        background:"rgba(201,169,98,.05)", marginBottom:48,
      }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:C.vg, animation:"pip 2s infinite" }} />
        <span className="mono" style={{ fontSize:".56rem", letterSpacing:".16em", color:C.vgl, textTransform:"uppercase" }}>
          Estimated 30 minutes
        </span>
      </div>

      {/* Steps checklist */}
      <div style={{ maxWidth:360, width:"100%", textAlign:"left" }}>
        {["Commission received","Workspace created","Brain allocated","Email configured","Northstar pending"].map((s,i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:12,
            padding:"10px 0", borderBottom:"1px solid rgba(201,169,98,.08)",
            opacity: i < Math.floor(p/20) ? 1 : .35,
            transition:"opacity .5s ease",
          }}>
            <div style={{
              width:18, height:18, borderRadius:"50%",
              background: i < Math.floor(p/20) ? C.ok : "rgba(201,169,98,.1)",
              border: `1px solid ${i < Math.floor(p/20) ? C.ok : "rgba(201,169,98,.3)"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:".6rem", color:C.gesso, flexShrink:0,
              transition:"all .3s ease",
            }}>
              {i < Math.floor(p/20) ? "✓" : i+1}
            </div>
            <span className="mono" style={{ fontSize:".6rem", letterSpacing:".1em", color:i < Math.floor(p/20) ? C.gesso : C.ink4, textTransform:"uppercase" }}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 2. NORTHSTAR SCREEN
function NorthstarScreen({ onDone }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const questions = [
    { id:"name",    label:"What is your business name?",             placeholder:"e.g. The Butcher Shop JHB" },
    { id:"role",    label:"What is your role?",                      placeholder:"e.g. Owner, Manager, Director" },
    { id:"voice",   label:"How should your agent speak to customers?",placeholder:"e.g. Warm and friendly, Professional, Casual" },
    { id:"goal1",   label:"What is your #1 business goal?",          placeholder:"e.g. Never miss a customer query" },
    { id:"avoid",   label:"What should the agent never say or do?",  placeholder:"e.g. Never discuss pricing of competitors" },
    { id:"wa",      label:"Your WhatsApp Business number",           placeholder:"+27 82 000 0000" },
  ]

  const q = questions[step]
  const complete = step >= questions.length

  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:C.atelier, padding:"40px 24px",
      animation:"fadeIn .5s ease both",
    }}>
      <div style={{ maxWidth:520, width:"100%" }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div className="mono" style={{ fontSize:".56rem", letterSpacing:".26em", color:C.vg, textTransform:"uppercase", marginBottom:12 }}>
            Studex Northstar Framework
          </div>
          <div className="cinzel" style={{ fontSize:"clamp(1.6rem,4vw,2.2rem)", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:C.gesso, marginBottom:8 }}>
            Give {AGENT.givenName} Its Soul
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:"rgba(253,250,245,.5)", fontSize:"1rem" }}>
            Not a form — a founding ritual
          </div>
        </div>

        {!complete ? (
          <>
            {/* Progress */}
            <div style={{ display:"flex", gap:4, marginBottom:40 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  flex:1, height:2,
                  background: i <= step ? C.vg : "rgba(201,169,98,.15)",
                  transition:"background .3s ease",
                }} />
              ))}
            </div>

            {/* Question */}
            <div style={{ animation:"slideUp .4s ease both" }} key={step}>
              <div className="mono" style={{ fontSize:".52rem", letterSpacing:".2em", color:C.vg, textTransform:"uppercase", marginBottom:8 }}>
                Step {step+1} of {questions.length}
              </div>
              <label style={{ fontFamily:"'Cinzel',serif", fontSize:"1.1rem", fontWeight:700, color:C.gesso, display:"block", marginBottom:20, letterSpacing:".04em", textTransform:"uppercase" }}>
                {q.label}
              </label>
              <input
                type="text"
                placeholder={q.placeholder}
                value={answers[q.id] || ""}
                onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                onKeyDown={e => { if (e.key==="Enter" && answers[q.id]) setStep(s => s+1) }}
                autoFocus
                style={{
                  width:"100%", padding:"14px 16px",
                  background:"rgba(201,169,98,.06)", border:"1px solid rgba(201,169,98,.25)",
                  color:C.gesso, fontFamily:"'Cormorant Garamond',serif",
                  fontSize:"1.1rem", outline:"none",
                  transition:"border-color .2s",
                }}
              />
              <div className="mono" style={{ fontSize:".5rem", color:C.ink4, letterSpacing:".1em", marginTop:8, textTransform:"uppercase" }}>
                Press Enter to continue
              </div>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:40 }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s-1)} style={{
                  background:"transparent", border:"1px solid rgba(201,169,98,.2)",
                  color:C.ink4, fontFamily:"'Cinzel',serif", fontSize:".56rem",
                  fontWeight:700, letterSpacing:".18em", textTransform:"uppercase",
                  padding:"10px 20px", cursor:"pointer",
                }}>← Back</button>
              )}
              <button
                onClick={() => { if (answers[q.id]) setStep(s => s+1) }}
                disabled={!answers[q.id]}
                style={{
                  marginLeft:"auto", padding:"12px 32px",
                  background: answers[q.id] ? C.vg : "rgba(201,169,98,.2)",
                  border:"none", color:C.ink, fontFamily:"'Cinzel',serif",
                  fontSize:".6rem", fontWeight:700, letterSpacing:".2em",
                  textTransform:"uppercase", cursor: answers[q.id] ? "pointer" : "default",
                  transition:"background .2s",
                }}
              >
                Continue →
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", animation:"slideUp .5s ease both" }}>
            <div style={{ fontSize:"4rem", marginBottom:24 }}>✨</div>
            <div className="cinzel" style={{ fontSize:"1.6rem", fontWeight:700, color:C.vgl, letterSpacing:".06em", textTransform:"uppercase", marginBottom:16 }}>
              Soul Received
            </div>
            <div style={{ fontStyle:"italic", color:"rgba(253,250,245,.6)", marginBottom:40, lineHeight:1.7 }}>
              {AGENT.givenName} now knows who you are,<br/>how you speak, and what you stand for.
            </div>
            <button onClick={onDone} style={{
              padding:"14px 48px", background:C.gesso, color:C.ink,
              border:"none", fontFamily:"'Cinzel',serif", fontSize:".7rem",
              fontWeight:700, letterSpacing:".2em", textTransform:"uppercase",
              cursor:"pointer",
            }}>
              Meet {AGENT.givenName} →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// 3. MAIN DASHBOARD
function Dashboard() {
  const [tab, setTab] = useState("overview")
  const [showUpgrade, setShowUpgrade] = useState(false)
  const tokenPct = (AGENT.tokens_used / AGENT.tokens_max) * 100

  const tabs = [
    { id:"overview",  label:"Overview",  icon:"🏛️" },
    { id:"agent",     label:"My Agent",  icon:"🧠" },
    { id:"channels",  label:"Channels",  icon:"📡" },
    { id:"brain",     label:"Brain",     icon:"💡" },
    { id:"billing",   label:"Billing",   icon:"💳" },
  ]

  return (
    <div style={{ minHeight:"100vh", background:C.atelier, display:"flex", flexDirection:"column" }}>

      {/* Top nav */}
      <nav style={{
        height:64, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 32px",
        background:"rgba(13,12,11,.8)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(201,169,98,.1)",
        position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:"1.5rem" }}>{AGENT.icon}</span>
          <div>
            <div className="cinzel" style={{ fontSize:".7rem", fontWeight:700, letterSpacing:".16em", color:C.gesso, textTransform:"uppercase" }}>
              {AGENT.givenName}
            </div>
            <div className="mono" style={{ fontSize:".48rem", color:C.vg, letterSpacing:".12em", textTransform:"uppercase" }}>
              {AGENT.serial} · {AGENT.type}
            </div>
          </div>
        </div>

        {/* Live status */}
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 16px", border:"1px solid rgba(30,80,56,.5)", background:"rgba(30,80,56,.15)" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#3DC87A", animation:"pip 1.5s infinite" }} />
          <span className="mono" style={{ fontSize:".52rem", color:"#3DC87A", letterSpacing:".12em", textTransform:"uppercase" }}>Live</span>
        </div>

        {/* Token gauge */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div>
            <div className="mono" style={{ fontSize:".46rem", color:C.ink4, letterSpacing:".1em", textTransform:"uppercase", textAlign:"right", marginBottom:3 }}>
              Brain capacity
            </div>
            <div style={{ width:140, height:4, background:"rgba(201,169,98,.1)", borderRadius:2, overflow:"hidden" }}>
              <div style={{
                height:"100%", borderRadius:2,
                background: tokenPct > 80 ? "#8A2020" : `linear-gradient(90deg, ${C.vgd}, ${C.vgl})`,
                width:`${tokenPct}%`, transition:"width .5s ease",
              }} />
            </div>
          </div>
          <span className="mono" style={{ fontSize:".56rem", color: tokenPct > 80 ? "#D44A4A" : C.vg }}>
            {tokenPct.toFixed(0)}%
          </span>
        </div>
      </nav>

      <div style={{ display:"flex", flex:1 }}>

        {/* Sidebar */}
        <aside style={{
          width:200, background:"rgba(13,12,11,.6)",
          borderRight:"1px solid rgba(201,169,98,.08)",
          padding:"24px 0", flexShrink:0,
          display:"flex", flexDirection:"column",
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"12px 24px", background:"transparent",
              border:"none", cursor:"pointer",
              borderLeft: tab===t.id ? `2px solid ${C.vg}` : "2px solid transparent",
              transition:"all .2s",
            }}>
              <span style={{ fontSize:"1rem" }}>{t.icon}</span>
              <span className="cinzel" style={{
                fontSize:".6rem", fontWeight:700, letterSpacing:".12em",
                textTransform:"uppercase",
                color: tab===t.id ? C.vgl : C.ink4,
                transition:"color .2s",
              }}>
                {t.label}
              </span>
            </button>
          ))}

          <div style={{ flex:1 }} />

          {/* Plan badge */}
          <div style={{ margin:"0 16px 16px", padding:"12px", border:"1px solid rgba(201,169,98,.2)", background:"rgba(201,169,98,.06)" }}>
            <div className="mono" style={{ fontSize:".48rem", color:C.vg, letterSpacing:".14em", textTransform:"uppercase", marginBottom:4 }}>Current Plan</div>
            <div className="cinzel" style={{ fontSize:".75rem", fontWeight:700, color:C.gesso }}>{AGENT.plan}</div>
            <div className="mono" style={{ fontSize:".48rem", color:C.ink4, marginTop:2 }}>R{AGENT.monthlyR.toLocaleString()}/mo</div>
            <button onClick={() => setShowUpgrade(true)} style={{
              marginTop:8, width:"100%", padding:"6px",
              background:"transparent", border:"1px solid rgba(201,169,98,.3)",
              color:C.vg, fontFamily:"'JetBrains Mono',monospace",
              fontSize:".48rem", letterSpacing:".1em", textTransform:"uppercase",
              cursor:"pointer",
            }}>
              Upgrade ↑
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex:1, padding:"32px", overflow:"auto" }}>
          {tab === "overview" && <Overview setTab={setTab} />}
          {tab === "agent"    && <AgentView />}
          {tab === "channels" && <Channels />}
          {tab === "brain"    && <Brain tokenPct={tokenPct} />}
          {tab === "billing"  && <Billing setShowUpgrade={setShowUpgrade} />}
        </main>
      </div>

      {/* Upgrade modal */}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  )
}

// Overview tab
function Overview({ setTab }) {
  const stats = [
    { label:"Conversations",      value:AGENT.conversations.toLocaleString(), unit:"this month",     color:C.vg },
    { label:"Carts Recovered",    value:AGENT.carts_recovered,                unit:"orders saved",  color:"#3DC87A" },
    { label:"Revenue Generated",  value:`R${AGENT.revenue_generated.toLocaleString()}`, unit:"attributed", color:C.vgl },
    { label:"Avg Response Time",  value:"8s",                                  unit:"day & night",   color:C.vg },
  ]

  return (
    <div style={{ animation:"fadeUp .4s ease both" }}>
      <div className="cinzel" style={{ fontSize:".56rem", fontWeight:700, letterSpacing:".24em", color:C.vg, textTransform:"uppercase", marginBottom:4 }}>
        Command Overview
      </div>
      <h1 className="cinzel" style={{ fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:700, color:C.gesso, textTransform:"uppercase", letterSpacing:".04em", marginBottom:32 }}>
        Good evening, {AGENT.givenName} is working.
      </h1>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:2, background:C.rule, marginBottom:32 }}>
        {stats.map((s,i) => (
          <div key={i} style={{
            background:C.atelier2, padding:"24px 20px",
            borderTop:`2px solid ${s.color}`,
            animation:`fadeUp .4s ease ${i*.08}s both`,
          }}>
            <div className="cinzel" style={{ fontSize:"clamp(1.4rem,2.5vw,2rem)", fontWeight:700, color:s.color, lineHeight:1, marginBottom:6 }}>
              {s.value}
            </div>
            <div className="mono" style={{ fontSize:".52rem", color:C.ink4, letterSpacing:".12em", textTransform:"uppercase", marginBottom:2 }}>
              {s.label}
            </div>
            <div style={{ fontStyle:"italic", fontSize:".78rem", color:C.ink4 }}>{s.unit}</div>
          </div>
        ))}
      </div>

      {/* Recent conversations */}
      <div className="mono" style={{ fontSize:".52rem", letterSpacing:".2em", color:C.vg, textTransform:"uppercase", marginBottom:16 }}>
        Recent Conversations
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2, background:C.rule }}>
        {CONVOS.map((c,i) => (
          <div key={i} style={{
            background:C.atelier2, padding:"16px 20px",
            display:"grid", gridTemplateColumns:"56px 1fr 1fr auto",
            gap:16, alignItems:"start",
            animation:`fadeUp .4s ease ${.1+i*.06}s both`,
          }}>
            <div className="mono" style={{ fontSize:".52rem", color:C.ink4, paddingTop:2 }}>{c.time}</div>
            <div>
              <div className="cinzel" style={{ fontSize:".62rem", fontWeight:700, color:C.gesso, letterSpacing:".08em", marginBottom:4 }}>
                {c.from}
              </div>
              <div style={{ fontStyle:"italic", fontSize:".85rem", color:C.ink3 }}>{c.msg}</div>
            </div>
            <div style={{ fontStyle:"italic", fontSize:".85rem", color:"rgba(253,250,245,.6)", borderLeft:"1px solid rgba(201,169,98,.15)", paddingLeft:16 }}>
              {c.reply}
            </div>
            <div style={{
              padding:"3px 8px", fontSize:".46rem",
              background:c.channel==="wa" ? "rgba(37,211,102,.1)" : "rgba(201,169,98,.1)",
              color:c.channel==="wa" ? "#25D366" : C.vg,
              fontFamily:"'JetBrains Mono',monospace", letterSpacing:".08em", textTransform:"uppercase",
            }}>
              {c.channel}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Agent tab
function AgentView() {
  return (
    <div style={{ animation:"fadeUp .4s ease both" }}>
      <div className="mono" style={{ fontSize:".52rem", letterSpacing:".2em", color:C.vg, textTransform:"uppercase", marginBottom:4 }}>The Masterwork</div>
      <h2 className="cinzel" style={{ fontSize:"clamp(1.2rem,2.5vw,1.8rem)", fontWeight:700, color:C.gesso, textTransform:"uppercase", letterSpacing:".04em", marginBottom:32 }}>
        {AGENT.givenName} · {AGENT.name}
      </h2>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        {/* Identity card */}
        <div style={{ background:C.atelier2, border:"1px solid rgba(201,169,98,.15)", padding:"28px", borderTop:`2px solid ${AGENT.pigment}` }}>
          <div className="mono" style={{ fontSize:".5rem", color:C.vg, letterSpacing:".16em", textTransform:"uppercase", marginBottom:4 }}>{AGENT.serial}</div>
          <div className="cinzel" style={{ fontSize:".6rem", fontWeight:700, color:AGENT.pigment, letterSpacing:".08em", textTransform:"uppercase", marginBottom:2 }}>
            {AGENT.type}
          </div>
          <div style={{ fontStyle:"italic", fontSize:".75rem", color:C.ink4, marginBottom:16 }}>after {AGENT.master}</div>
          <div style={{ fontSize:".68rem", fontStyle:"italic", color:C.ink4, marginBottom:4 }}>"{AGENT.work}"</div>
          <div style={{ height:1, background:"rgba(201,169,98,.15)", margin:"16px 0" }} />
          <div className="mono" style={{ fontSize:".5rem", color:C.ink4, letterSpacing:".1em", textTransform:"uppercase", marginBottom:4 }}>Agent Email</div>
          <div className="mono" style={{ fontSize:".56rem", color:C.vg }}>{AGENT.email}</div>
        </div>

        {/* Soul card */}
        <div style={{ background:C.atelier2, border:"1px solid rgba(201,169,98,.15)", padding:"28px" }}>
          <div className="mono" style={{ fontSize:".5rem", color:C.vg, letterSpacing:".16em", textTransform:"uppercase", marginBottom:12 }}>Obsidian Soul</div>
          <div style={{ fontStyle:"italic", fontSize:"1rem", color:"rgba(253,250,245,.75)", lineHeight:1.72 }}>
            "{AGENT.soul}"
          </div>
          <div style={{ height:1, background:"rgba(201,169,98,.15)", margin:"20px 0" }} />
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#3DC87A" }} />
            <span className="mono" style={{ fontSize:".5rem", color:"#3DC87A", letterSpacing:".12em", textTransform:"uppercase" }}>
              Northstar complete · Soul active
            </span>
          </div>
        </div>
      </div>

      {/* WhatsApp mock */}
      <div style={{ marginTop:24 }}>
        <div className="mono" style={{ fontSize:".52rem", letterSpacing:".2em", color:C.vg, textTransform:"uppercase", marginBottom:12 }}>
          Live Conversation Preview
        </div>
        <div style={{ background:"#ECE5DD", borderRadius:10, padding:"16px 14px", maxWidth:400, fontFamily:"'Helvetica Neue',sans-serif" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:12, borderBottom:"1px solid rgba(0,0,0,.08)", marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:AGENT.pigment, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>
              {AGENT.icon}
            </div>
            <div>
              <div style={{ fontSize:".78rem", fontWeight:600, color:"#1a1a1a" }}>{AGENT.givenName} · Your Agent</div>
              <div style={{ fontSize:".65rem", color:"#667781" }}>● Online</div>
            </div>
          </div>
          {[
            { me:false, msg:"Hi, do you have wagyu biltong in stock?" },
            { me:true,  msg:"Yes! Original, Chilli & Peri-Peri — R189 each 🥩 Free delivery over R500 tonight" },
            { me:false, msg:"Perfect, 2x Original please" },
            { me:true,  msg:"✓ Added to cart — R378. Sending payment link now 👇" },
          ].map((m,i) => (
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.me ? "flex-end" : "flex-start", marginBottom:6 }}>
              <div style={{
                maxWidth:"75%", padding:"7px 11px", borderRadius:8, fontSize:".78rem", lineHeight:1.4,
                background:m.me ? "#DCF8C6" : "#fff",
                borderTopRightRadius:m.me ? 2 : 8, borderTopLeftRadius:m.me ? 8 : 2,
              }}>
                {m.msg}
              </div>
            </div>
          ))}
          <div style={{ display:"flex", gap:4, alignItems:"center", marginTop:4 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#999", animation:"pip .9s infinite" }} />
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#999", animation:"pip .9s .15s infinite" }} />
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#999", animation:"pip .9s .3s infinite" }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Channels tab
function Channels() {
  const [channels, setChannels] = useState(CHANNELS)

  const toggle = (id) => {
    setChannels(ch => ch.map(c => c.id===id ? { ...c, status: c.status==="connected" ? "disconnected" : "connecting" } : c))
    setTimeout(() => {
      setChannels(ch => ch.map(c => c.id===id && c.status==="connecting" ? { ...c, status:"connected" } : c))
    }, 2000)
  }

  return (
    <div style={{ animation:"fadeUp .4s ease both" }}>
      <div className="mono" style={{ fontSize:".52rem", letterSpacing:".2em", color:C.vg, textTransform:"uppercase", marginBottom:4 }}>Connections</div>
      <h2 className="cinzel" style={{ fontSize:"clamp(1.2rem,2.5vw,1.8rem)", fontWeight:700, color:C.gesso, textTransform:"uppercase", letterSpacing:".04em", marginBottom:8 }}>
        Channel Management
      </h2>
      <p style={{ fontStyle:"italic", color:C.ink4, marginBottom:32, fontSize:"1rem" }}>
        Connect {AGENT.givenName} to the platforms your customers use.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:2, background:C.rule }}>
        {channels.map((c,i) => (
          <div key={c.id} style={{
            background:C.atelier2, padding:"20px 24px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            animation:`fadeUp .3s ease ${i*.06}s both`,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{
                width:44, height:44, borderRadius:"50%",
                background:`${c.color}18`, border:`1px solid ${c.color}40`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"1.3rem",
              }}>
                {c.icon}
              </div>
              <div>
                <div className="cinzel" style={{ fontSize:".75rem", fontWeight:700, color:C.gesso, letterSpacing:".1em", textTransform:"uppercase" }}>{c.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                  <div style={{
                    width:5, height:5, borderRadius:"50%",
                    background: c.status==="connected" ? "#3DC87A" : c.status==="connecting" ? C.vg : C.ink4,
                    animation: c.status==="connecting" ? "pip 1s infinite" : "none",
                  }} />
                  <span className="mono" style={{ fontSize:".48rem", letterSpacing:".1em", textTransform:"uppercase",
                    color: c.status==="connected" ? "#3DC87A" : c.status==="connecting" ? C.vg : C.ink4 }}>
                    {c.status}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => toggle(c.id)} style={{
              padding:"8px 20px", border:"none", cursor:"pointer",
              background: c.status==="connected" ? "rgba(138,32,32,.2)" : c.status==="connecting" ? "rgba(201,169,98,.15)" : C.vg,
              color: c.status==="connected" ? "#D44A4A" : c.status==="connecting" ? C.vg : C.ink,
              fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem",
              fontWeight:500, letterSpacing:".12em", textTransform:"uppercase",
              transition:"all .2s",
            }}>
              {c.status==="connected" ? "Disconnect" : c.status==="connecting" ? "Connecting…" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Brain tab
function Brain({ tokenPct }) {
  const entries = [
    { icon:"🦷", label:"Dr Mpho — chair 2, no amalgam",     tag:"Patient pref" },
    { icon:"📅", label:"Thabo — missed last 2 appointments", tag:"Flag" },
    { icon:"💊", label:"Mrs Ahmed — halaal only",           tag:"Dietary" },
    { icon:"📞", label:"847 conversations stored",           tag:"Archive" },
    { icon:"📦", label:"Wagyu biltong stock levels",         tag:"Inventory" },
    { icon:"💰", label:"Bundle pricing rules",               tag:"Pricing" },
  ]

  return (
    <div style={{ animation:"fadeUp .4s ease both" }}>
      <div className="mono" style={{ fontSize:".52rem", letterSpacing:".2em", color:C.vg, textTransform:"uppercase", marginBottom:4 }}>Memory System</div>
      <h2 className="cinzel" style={{ fontSize:"clamp(1.2rem,2.5vw,1.8rem)", fontWeight:700, color:C.gesso, textTransform:"uppercase", letterSpacing:".04em", marginBottom:32 }}>
        Obsidian Brain
      </h2>

      {/* Token gauge */}
      <div style={{ background:C.atelier2, border:"1px solid rgba(201,169,98,.15)", padding:24, marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <div className="mono" style={{ fontSize:".52rem", color:C.vg, letterSpacing:".14em", textTransform:"uppercase", marginBottom:2 }}>Brain Capacity Used</div>
            <div className="cinzel" style={{ fontSize:"1.4rem", fontWeight:700, color:C.gesso }}>
              {(AGENT.tokens_used/1000000).toFixed(1)}M <span style={{ fontSize:".8rem", color:C.ink4 }}>/ {AGENT.tokens_max/1000000}M tokens</span>
            </div>
          </div>
          <div className="cinzel" style={{ fontSize:"2rem", fontWeight:700, color: tokenPct > 80 ? "#D44A4A" : C.vg }}>
            {tokenPct.toFixed(0)}%
          </div>
        </div>
        <div style={{ height:8, background:"rgba(201,169,98,.1)", borderRadius:4, overflow:"hidden" }}>
          <div style={{
            height:"100%", borderRadius:4,
            background: tokenPct > 80 ? `linear-gradient(90deg, #8A2020, #D44A4A)` : `linear-gradient(90deg, ${C.vgd}, ${C.vgl})`,
            width:`${tokenPct}%`, transition:"width .5s ease",
          }} />
        </div>
        {tokenPct > 60 && (
          <div className="mono" style={{ fontSize:".5rem", color: tokenPct > 80 ? "#D44A4A" : C.vg, marginTop:8, letterSpacing:".1em", textTransform:"uppercase" }}>
            {tokenPct > 80 ? "⚠ Consider upgrading your plan" : "ℹ 40% remaining"}
          </div>
        )}
      </div>

      {/* Brain entries */}
      <div className="mono" style={{ fontSize:".5rem", letterSpacing:".18em", color:C.vg, textTransform:"uppercase", marginBottom:12 }}>
        Stored Knowledge
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2, background:C.rule }}>
        {entries.map((e,i) => (
          <div key={i} style={{
            background:C.atelier2, padding:"14px 20px",
            display:"flex", alignItems:"center", gap:14,
            animation:`fadeUp .3s ease ${i*.05}s both`,
          }}>
            <span style={{ fontSize:"1rem" }}>{e.icon}</span>
            <span style={{ fontStyle:"italic", fontSize:".95rem", color:"rgba(253,250,245,.7)", flex:1 }}>{e.label}</span>
            <span className="mono" style={{ fontSize:".46rem", padding:"2px 8px", background:"rgba(201,169,98,.1)", color:C.vg, letterSpacing:".08em", textTransform:"uppercase" }}>
              {e.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Billing tab
function Billing({ setShowUpgrade }) {
  return (
    <div style={{ animation:"fadeUp .4s ease both" }}>
      <div className="mono" style={{ fontSize:".52rem", letterSpacing:".2em", color:C.vg, textTransform:"uppercase", marginBottom:4 }}>Account</div>
      <h2 className="cinzel" style={{ fontSize:"clamp(1.2rem,2.5vw,1.8rem)", fontWeight:700, color:C.gesso, textTransform:"uppercase", letterSpacing:".04em", marginBottom:32 }}>
        Subscription & Credits
      </h2>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:24 }}>
        {/* Current plan */}
        <div style={{ background:C.atelier2, border:"1px solid rgba(201,169,98,.25)", borderTop:`2px solid ${C.vg}`, padding:24 }}>
          <div className="mono" style={{ fontSize:".5rem", color:C.vg, letterSpacing:".14em", textTransform:"uppercase", marginBottom:8 }}>Current Plan</div>
          <div className="cinzel" style={{ fontSize:"1.6rem", fontWeight:700, color:C.gesso, marginBottom:4 }}>{AGENT.plan}</div>
          <div className="cinzel" style={{ fontSize:"1.8rem", fontWeight:700, color:C.vg }}>R{AGENT.monthlyR.toLocaleString()}<span style={{ fontSize:"1rem", color:C.ink4 }}>/mo</span></div>
          <div style={{ height:1, background:"rgba(201,169,98,.15)", margin:"16px 0" }} />
          <div className="mono" style={{ fontSize:".5rem", color:C.ink4, letterSpacing:".1em", textTransform:"uppercase", marginBottom:4 }}>Next billing</div>
          <div style={{ fontStyle:"italic", color:"rgba(253,250,245,.7)", fontSize:".9rem" }}>1 June 2026</div>
          <button onClick={() => setShowUpgrade(true)} style={{
            marginTop:16, width:"100%", padding:"10px",
            background:C.vg, border:"none", color:C.ink,
            fontFamily:"'Cinzel',serif", fontSize:".6rem", fontWeight:700,
            letterSpacing:".18em", textTransform:"uppercase", cursor:"pointer",
          }}>
            Upgrade Plan ↑
          </button>
        </div>

        {/* API Credits */}
        <div style={{ background:C.atelier2, border:"1px solid rgba(201,169,98,.15)", padding:24 }}>
          <div className="mono" style={{ fontSize:".5rem", color:C.vg, letterSpacing:".14em", textTransform:"uppercase", marginBottom:8 }}>API Credits</div>
          <div className="cinzel" style={{ fontSize:"1.6rem", fontWeight:700, color:C.gesso, marginBottom:4 }}>R240.00</div>
          <div style={{ fontStyle:"italic", color:C.ink4, fontSize:".85rem", marginBottom:16 }}>Balance remaining this month</div>
          <div style={{ height:6, background:"rgba(201,169,98,.1)", borderRadius:3, overflow:"hidden", marginBottom:8 }}>
            <div style={{ height:"100%", width:"48%", borderRadius:3, background:`linear-gradient(90deg, ${C.vgd}, ${C.vgl})` }} />
          </div>
          <div className="mono" style={{ fontSize:".48rem", color:C.ink4, letterSpacing:".08em", textTransform:"uppercase", marginBottom:16 }}>
            48% used · R240 remaining
          </div>
          {[100, 250, 500].map(amt => (
            <button key={amt} style={{
              display:"block", width:"100%", padding:"8px",
              background:"rgba(201,169,98,.06)", border:"1px solid rgba(201,169,98,.2)",
              color:C.vg, fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem",
              letterSpacing:".1em", textTransform:"uppercase", cursor:"pointer",
              marginBottom:4,
            }}>
              + Top up R{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="mono" style={{ fontSize:".5rem", letterSpacing:".18em", color:C.vg, textTransform:"uppercase", marginBottom:12 }}>Payment History</div>
      {[
        { date:"1 May 2026",  desc:"Business Plan — Monthly",   amount:"R7,500", status:"Paid" },
        { date:"1 Apr 2026",  desc:"Business Plan — Monthly",   amount:"R7,500", status:"Paid" },
        { date:"15 Mar 2026", desc:"API Credits Top-up",         amount:"R250",  status:"Paid" },
        { date:"1 Mar 2026",  desc:"Business Plan — Monthly",   amount:"R7,500", status:"Paid" },
      ].map((t,i) => (
        <div key={i} style={{
          display:"grid", gridTemplateColumns:"140px 1fr auto auto",
          gap:16, padding:"12px 20px",
          background: i%2===0 ? C.atelier2 : "rgba(13,12,11,.4)",
          borderBottom:"1px solid rgba(201,169,98,.06)",
          alignItems:"center",
        }}>
          <span className="mono" style={{ fontSize:".5rem", color:C.ink4 }}>{t.date}</span>
          <span style={{ fontStyle:"italic", fontSize:".9rem", color:"rgba(253,250,245,.7)" }}>{t.desc}</span>
          <span className="cinzel" style={{ fontSize:".75rem", fontWeight:700, color:C.gesso }}>{t.amount}</span>
          <span style={{ padding:"2px 10px", background:"rgba(30,80,56,.2)", color:"#3DC87A", fontFamily:"'JetBrains Mono',monospace", fontSize:".46rem", letterSpacing:".08em", textTransform:"uppercase" }}>
            {t.status}
          </span>
        </div>
      ))}
    </div>
  )
}

// Upgrade modal
function UpgradeModal({ onClose }) {
  const plans = [
    { name:"Starter",    price:"R3,500",  features:["1 agent","2M brain tokens","WhatsApp + email","Email support"],          solid:false },
    { name:"Business",   price:"R7,500",  features:["Everything in Starter","Outbound calling","5M brain tokens","Priority support"], solid:true  },
    { name:"Enterprise", price:"Custom",  features:["Unlimited brain","Multiple agents","White-label","SLA + conductor"],     solid:false },
  ]

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:200,
      background:"rgba(13,12,11,.85)", backdropFilter:"blur(12px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24, animation:"fadeIn .2s ease both",
    }} onClick={e => { if (e.target===e.currentTarget) onClose() }}>
      <div style={{
        background:C.atelier, border:"1px solid rgba(201,169,98,.2)",
        borderTop:`2px solid ${C.vg}`, padding:40, maxWidth:720, width:"100%",
        animation:"slideUp .3s ease both",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:32 }}>
          <div>
            <div className="cinzel" style={{ fontSize:"1.4rem", fontWeight:700, color:C.gesso, textTransform:"uppercase", letterSpacing:".06em" }}>
              Upgrade Your Plan
            </div>
            <div style={{ fontStyle:"italic", color:C.ink4, marginTop:4 }}>More brain. More power. More {AGENT.givenName}.</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.ink4, fontSize:"1.2rem", cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, background:C.rule }}>
          {plans.map(p => (
            <div key={p.name} style={{
              background: p.solid ? "#221A10" : C.atelier,
              padding:24, borderTop: p.solid ? `2px solid ${C.vg}` : "2px solid transparent",
            }}>
              <div className="mono" style={{ fontSize:".52rem", color:C.ink4, letterSpacing:".18em", textTransform:"uppercase", marginBottom:8 }}>{p.name}</div>
              <div className="cinzel" style={{ fontSize:"1.6rem", fontWeight:700, color: p.solid ? C.vg : C.gesso, marginBottom:16 }}>{p.price}</div>
              {p.features.map(f => (
                <div key={f} style={{ display:"flex", gap:8, marginBottom:8, fontSize:".88rem", color:"rgba(253,250,245,.65)", fontStyle:"italic" }}>
                  <span style={{ color:C.vg, flexShrink:0 }}>—</span> {f}
                </div>
              ))}
              <button style={{
                marginTop:16, width:"100%", padding:"10px",
                background: p.solid ? C.vg : "transparent",
                border: p.solid ? "none" : "1px solid rgba(201,169,98,.3)",
                color: p.solid ? C.ink : C.vg,
                fontFamily:"'Cinzel',serif", fontSize:".56rem", fontWeight:700,
                letterSpacing:".16em", textTransform:"uppercase", cursor:"pointer",
              }}>
                {p.name==="Enterprise" ? "Contact Us" : "Select"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("provisioning") // provisioning | northstar | dashboard

  return (
    <>
      <style>{css}</style>
      <div className="grain" />
      {screen === "provisioning" && <ProvisioningScreen onDone={() => setScreen("northstar")} />}
      {screen === "northstar"    && <NorthstarScreen    onDone={() => setScreen("dashboard")} />}
      {screen === "dashboard"    && <Dashboard />}
    </>
  )
}

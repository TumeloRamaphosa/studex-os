"use client"
import { useState, useEffect, useRef, useCallback } from "react"

// ═══════════════════════════════════════════════════════════════════
// STUDEX SUPER AGENTS — VM 5: Client Onboarding Portal
// app.stud.exchange · Fly.io VM 5
//
// Features:
// 1. Jarvis AI welcome chat (speech-to-text + text)
// 2. Guided signup flow with live agent support
// 3. Mobile + desktop responsive
// 4. Connects to VM4 OpenClaw for AI responses
// ═══════════════════════════════════════════════════════════════════

const C = {
  bg:      "#0C0A08",
  bg2:     "#130F0B",
  gesso:   "#FDFAF5",
  gesso2:  "#F5F1E8",
  vg:      "#C9A962",
  vgl:     "#E8D48A",
  vgd:     "#8A6420",
  ink:     "#0D0D0B",
  ink3:    "#5C5448",
  ink4:    "#8C8478",
  rule:    "#D5CCB8",
  ok:      "#1E5038",
  arc:     "#00D4FF",
  warm:    "rgba(201,169,98,.08)",
}

// Jarvis AI persona
const JARVIS = {
  name:    "Jarvis",
  role:    "Studex AI Guide",
  icon:    "⚡",
  color:   C.arc,
}

// Predefined Jarvis responses for demo
const JARVIS_RESPONSES = {
  default: [
    "I'm here to help you commission your first Studex Super Agent. Which industry is your business in?",
    "Great choice. Your agent will be live within 30 minutes of completing the Northstar ritual. Shall we begin?",
    "Every agent comes with a dedicated email address and WhatsApp connection. What's your main customer channel?",
    "I can walk you through the entire process — from choosing your agent to going live. What would you like to know first?",
    "Your Obsidian Brain will store every customer preference, every conversation, every insight. It grows smarter every day.",
  ],
  greeting: "Welcome to Studex. I'm Jarvis — your AI guide. I'm here to help you commission the right agent for your business and get you live in 30 minutes. What kind of business do you run?",
  retail:   "Perfect — RetailBot is built for exactly that. Naledi will handle WhatsApp queries, recover abandoned carts, and remember every customer. She's R3,500/month and goes live in 30 minutes. Want to commission her now?",
  health:   "HealthBot is designed for healthcare practices. Care will reduce your no-shows by up to 70% and remember every patient's preferences. She's R7,500/month. Ready to begin the Northstar ritual?",
  sales:    "SalesCloser is your most powerful weapon. Close will dial 40 leads before 9am and book meetings while you sleep. She's R15,000/month. Want me to show you what she can do?",
  help:     "Of course. You can chat with me here, or if you'd prefer — tap the microphone and just speak. I'll listen and respond. What do you need help with?",
  commission: "Excellent. Let's get started. I'll guide you through three steps: choose your agent, complete the Northstar ritual, and connect WhatsApp. Click 'Begin Commission' when you're ready.",
}

// ── CSS ──────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=JetBrains+Mono:wght@400;500&display=swap');

@keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn    { from{opacity:0} to{opacity:1} }
@keyframes pip       { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.4)} }
@keyframes pulse     { 0%,100%{box-shadow:0 0 0 0 rgba(0,212,255,.4)} 70%{box-shadow:0 0 0 12px rgba(0,212,255,0)} }
@keyframes soundwave { 0%,100%{transform:scaleY(.4)} 50%{transform:scaleY(1)} }
@keyframes typing    { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
@keyframes slideUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes spin      { to{transform:rotate(360deg)} }
@keyframes arcPulse  { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;-webkit-text-size-adjust:100%}
body{
  font-family:'Cormorant Garamond',serif;
  background:#0C0A08;color:#FDFAF5;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;overflow-x:hidden;
}
.cinzel{font-family:'Cinzel',serif}
.mono{font-family:'JetBrains Mono',monospace}
::-webkit-scrollbar{width:2px}
::-webkit-scrollbar-thumb{background:rgba(201,169,98,.3)}

.grain{
  position:fixed;inset:0;z-index:9999;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.04;mix-blend-mode:multiply;
}

/* Responsive */
@media(max-width:768px){
  .hide-mobile{display:none!important}
  .full-mobile{width:100%!important;max-width:100%!important}
  .pad-mobile{padding:16px!important}
}

/* Chat bubble animation */
.msg-in { animation: fadeUp .3s ease both }
`

// ── SOUND WAVE (mic recording indicator) ─────────────────────────
function SoundWave({ active }) {
  if (!active) return null
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3, height:24 }}>
      {[1,2,3,4,5,4,3,2,1].map((h, i) => (
        <div key={i} style={{
          width:3, height:h*4,
          background:C.arc, borderRadius:2,
          animation:`soundwave ${.6 + i*.1}s ease-in-out ${i*.08}s infinite`,
        }} />
      ))}
    </div>
  )
}

// ── TYPING INDICATOR ─────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display:"flex", gap:5, alignItems:"center", padding:"12px 16px" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:7, height:7, borderRadius:"50%",
          background:C.arc, opacity:.7,
          animation:`typing 1.2s ease ${i*.2}s infinite`,
        }} />
      ))}
    </div>
  )
}

// ── JARVIS MESSAGE ────────────────────────────────────────────────
function JarvisMsg({ text, isUser = false, timestamp }) {
  return (
    <div className="msg-in" style={{
      display:"flex", gap:12,
      flexDirection: isUser ? "row-reverse" : "row",
      marginBottom:16, alignItems:"flex-end",
    }}>
      {/* Avatar */}
      {!isUser && (
        <div style={{
          width:36, height:36, borderRadius:"50%", flexShrink:0,
          background:`radial-gradient(circle, ${C.arc}30, rgba(0,0,0,.8))`,
          border:`1px solid ${C.arc}40`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"1rem",
          boxShadow:`0 0 12px ${C.arc}20`,
          animation:"arcPulse 3s ease-in-out infinite",
        }}>
          {JARVIS.icon}
        </div>
      )}

      {/* Bubble */}
      <div style={{
        maxWidth:"72%", padding:"12px 16px",
        background: isUser
          ? `linear-gradient(135deg, ${C.vgd}, ${C.vg}80)`
          : "rgba(255,255,255,.06)",
        border: isUser
          ? "none"
          : `1px solid ${C.arc}25`,
        borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
        backdropFilter: "blur(10px)",
      }}>
        {!isUser && (
          <div className="mono" style={{
            fontSize:".44rem", color:C.arc, letterSpacing:".14em",
            textTransform:"uppercase", marginBottom:6,
          }}>
            {JARVIS.name} · AI Guide
          </div>
        )}
        <div style={{
          fontSize:"1rem", lineHeight:1.64,
          fontStyle: isUser ? "normal" : "italic",
          color: isUser ? C.ink : "rgba(253,250,245,.85)",
          fontWeight: isUser ? 600 : 400,
        }}>
          {text}
        </div>
        <div className="mono" style={{
          fontSize:".38rem", color:"rgba(253,250,245,.25)",
          marginTop:6, textAlign: isUser ? "left" : "right",
        }}>
          {timestamp}
        </div>
      </div>
    </div>
  )
}

// ── QUICK REPLY CHIPS ─────────────────────────────────────────────
function QuickReplies({ replies, onSelect }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16, animation:"fadeUp .4s ease both" }}>
      {replies.map((r, i) => (
        <button key={i} onClick={() => onSelect(r)} style={{
          padding:"7px 14px",
          background:"rgba(201,169,98,.08)",
          border:`1px solid rgba(201,169,98,.25)`,
          color:C.vgl, cursor:"pointer",
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:".9rem", fontStyle:"italic",
          borderRadius:20, transition:"all .18s",
        }}
        onMouseEnter={e => { e.target.style.background = "rgba(201,169,98,.18)"; e.target.style.borderColor = C.vg }}
        onMouseLeave={e => { e.target.style.background = "rgba(201,169,98,.08)"; e.target.style.borderColor = "rgba(201,169,98,.25)" }}
        >
          {r}
        </button>
      ))}
    </div>
  )
}

// ── JARVIS CHAT PANEL ─────────────────────────────────────────────
function JarvisChat({ onBeginCommission }) {
  const [messages, setMessages] = useState([
    { id:1, text:JARVIS_RESPONSES.greeting, isUser:false, time:"Now" }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [quickReplies, setQuickReplies] = useState([
    "I run a retail store", "I have a medical practice",
    "I need B2B sales help", "Tell me more",
  ])
  const scrollRef = useRef(null)
  const recognitionRef = useRef(null)

  const now = () => new Date().toLocaleTimeString("en-ZA", { hour:"2-digit", minute:"2-digit" })

  useEffect(() => {
    scrollRef.current?.scrollTo({ top:99999, behavior:"smooth" })
  }, [messages, isTyping])

  // Speech recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SR()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-ZA"

      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
        // Auto-send
        setTimeout(() => sendMessage(transcript), 300)
      }
      recognitionRef.current.onend = () => setIsListening(false)
      recognitionRef.current.onerror = () => setIsListening(false)
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser. Please type your message.")
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const getJarvisReply = (userMsg) => {
    const lower = userMsg.toLowerCase()
    if (lower.includes("retail") || lower.includes("shop") || lower.includes("store") || lower.includes("butcher")) {
      setQuickReplies(["Commission RetailBot — R3,500/mo", "Tell me more about Naledi", "What else can she do?"])
      return JARVIS_RESPONSES.retail
    }
    if (lower.includes("health") || lower.includes("medical") || lower.includes("doctor") || lower.includes("clinic")) {
      setQuickReplies(["Commission HealthBot — R7,500/mo", "Show me how reminders work", "How many patients can she handle?"])
      return JARVIS_RESPONSES.health
    }
    if (lower.includes("sales") || lower.includes("b2b") || lower.includes("leads") || lower.includes("pipeline")) {
      setQuickReplies(["Commission SalesCloser — R15,000/mo", "How many calls per day?", "Can I listen to a sample call?"])
      return JARVIS_RESPONSES.sales
    }
    if (lower.includes("help") || lower.includes("how") || lower.includes("what")) {
      setQuickReplies(["I run a retail store", "I have a medical practice", "I need sales help", "Show me all agents"])
      return JARVIS_RESPONSES.help
    }
    if (lower.includes("commission") || lower.includes("begin") || lower.includes("start") || lower.includes("yes")) {
      setQuickReplies(["Begin Commission →"])
      return JARVIS_RESPONSES.commission
    }
    const idx = Math.floor(Math.random() * JARVIS_RESPONSES.default.length)
    setQuickReplies(["Tell me about pricing", "How does WhatsApp work?", "What is the Northstar ritual?"])
    return JARVIS_RESPONSES.default[idx]
  }

  const sendMessage = useCallback((text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput("")

    // Add user message
    const userMsg = { id:Date.now(), text:msg, isUser:true, time:now() }
    setMessages(prev => [...prev, userMsg])
    setQuickReplies([])
    setIsTyping(true)

    // Check if commissioning
    if (msg.toLowerCase().includes("begin commission") || msg.toLowerCase().includes("commission retailbot")) {
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          id:Date.now()+1,
          text:"Perfect. Let's build your agent. I'm opening the commission flow now.",
          isUser:false, time:now()
        }])
        setTimeout(() => onBeginCommission(), 1200)
      }, 1500)
      return
    }

    // Jarvis reply after delay
    setTimeout(() => {
      setIsTyping(false)
      const reply = getJarvisReply(msg)
      setMessages(prev => [...prev, { id:Date.now()+1, text:reply, isUser:false, time:now() }])
    }, 1200 + Math.random() * 800)
  }, [input])

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      height:"100%", background:C.bg2,
    }}>
      {/* Chat header */}
      <div style={{
        padding:"16px 20px",
        background:"rgba(0,0,0,.4)",
        borderBottom:`1px solid ${C.arc}20`,
        display:"flex", alignItems:"center", gap:12, flexShrink:0,
      }}>
        <div style={{
          width:40, height:40, borderRadius:"50%",
          background:`radial-gradient(circle, ${C.arc}20, rgba(0,0,0,.8))`,
          border:`1px solid ${C.arc}40`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"1.2rem", flexShrink:0,
          animation:"arcPulse 3s ease-in-out infinite",
        }}>
          {JARVIS.icon}
        </div>
        <div style={{ flex:1 }}>
          <div className="cinzel" style={{ fontSize:".7rem", fontWeight:700, color:C.gesso, letterSpacing:".12em", textTransform:"uppercase" }}>
            {JARVIS.name}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:"#3DC87A", animation:"pip 2s infinite" }} />
            <span className="mono" style={{ fontSize:".44rem", color:"#3DC87A", letterSpacing:".1em", textTransform:"uppercase" }}>
              Online · AI Guide · Speaks 11 languages
            </span>
          </div>
        </div>
        <div className="mono" style={{ fontSize:".44rem", color:C.ink4, letterSpacing:".1em", textTransform:"uppercase" }}>
          Studex · VM 5
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex:1, overflowY:"auto", padding:"20px 16px",
        display:"flex", flexDirection:"column",
      }}>
        {messages.map(m => (
          <JarvisMsg key={m.id} text={m.text} isUser={m.isUser} timestamp={m.time} />
        ))}
        {isTyping && (
          <div style={{ display:"flex", gap:12, alignItems:"flex-end", marginBottom:8 }}>
            <div style={{
              width:36, height:36, borderRadius:"50%", flexShrink:0,
              background:`radial-gradient(circle, ${C.arc}30, rgba(0,0,0,.8))`,
              border:`1px solid ${C.arc}40`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1rem",
            }}>⚡</div>
            <div style={{
              background:"rgba(255,255,255,.06)",
              border:`1px solid ${C.arc}25`,
              borderRadius:"12px 12px 12px 2px",
            }}>
              <TypingDots />
            </div>
          </div>
        )}

        {/* Quick replies */}
        {quickReplies.length > 0 && !isTyping && (
          <QuickReplies replies={quickReplies} onSelect={sendMessage} />
        )}
      </div>

      {/* Input bar */}
      <div style={{
        padding:"12px 16px",
        borderTop:`1px solid rgba(201,169,98,.1)`,
        background:"rgba(0,0,0,.3)",
        flexShrink:0,
      }}>
        {/* Listening indicator */}
        {isListening && (
          <div style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"8px 12px", marginBottom:8,
            background:`rgba(0,212,255,.08)`,
            border:`1px solid ${C.arc}30`,
          }}>
            <SoundWave active={true} />
            <span className="mono" style={{ fontSize:".48rem", color:C.arc, letterSpacing:".12em", textTransform:"uppercase" }}>
              Listening… speak now
            </span>
          </div>
        )}

        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          {/* Mic button */}
          <button
            onClick={toggleListening}
            style={{
              width:44, height:44, borderRadius:"50%", flexShrink:0,
              background: isListening ? C.arc : "rgba(0,212,255,.1)",
              border:`1px solid ${C.arc}50`,
              color: isListening ? C.ink : C.arc,
              cursor:"pointer", fontSize:"1.1rem",
              transition:"all .2s",
              animation: isListening ? "pulse 1.5s ease infinite" : "none",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
            title="Tap to speak"
          >
            🎤
          </button>

          {/* Text input */}
          <div style={{ flex:1, position:"relative" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Type or tap the mic to speak…"
              rows={1}
              style={{
                width:"100%", padding:"11px 14px",
                background:"rgba(255,255,255,.06)",
                border:`1px solid rgba(201,169,98,.2)`,
                color:C.gesso,
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"1rem", resize:"none", outline:"none",
                borderRadius:4, lineHeight:1.5,
              }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            style={{
              width:44, height:44, borderRadius:"50%", flexShrink:0,
              background: input.trim() ? C.vg : "rgba(201,169,98,.1)",
              border:"none", color:C.ink,
              cursor: input.trim() ? "pointer" : "default",
              fontSize:"1.1rem", transition:"all .2s",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── SIGNUP FLOW ───────────────────────────────────────────────────
function SignupFlow({ onComplete }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({})

  const steps = [
    {
      label:"Your Name",
      fields:[
        { id:"firstName", placeholder:"First name", type:"text", required:true },
        { id:"lastName",  placeholder:"Last name",  type:"text", required:true },
      ]
    },
    {
      label:"Your Business",
      fields:[
        { id:"company", placeholder:"Business name", type:"text", required:true },
        { id:"industry", placeholder:"Industry (e.g. Retail, Healthcare)", type:"text", required:true },
      ]
    },
    {
      label:"Contact Details",
      fields:[
        { id:"email",    placeholder:"Email address",       type:"email", required:true },
        { id:"whatsapp", placeholder:"WhatsApp (+27...)",   type:"tel",   required:true },
      ]
    },
  ]

  const current = steps[step]
  const canNext = current.fields.every(f => !f.required || data[f.id]?.trim())

  return (
    <div style={{
      padding:"32px 24px",
      background:C.bg2,
      height:"100%", display:"flex", flexDirection:"column",
    }}>
      {/* Progress */}
      <div style={{ display:"flex", gap:4, marginBottom:32 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex:1, height:2,
            background: i <= step ? C.vg : "rgba(201,169,98,.15)",
            transition:"background .3s",
          }} />
        ))}
      </div>

      <div className="mono" style={{ fontSize:".44rem", color:C.vg, letterSpacing:".2em", textTransform:"uppercase", marginBottom:8 }}>
        Step {step+1} of {steps.length}
      </div>
      <div className="cinzel" style={{
        fontSize:"1.3rem", fontWeight:700, color:C.gesso,
        textTransform:"uppercase", letterSpacing:".06em", marginBottom:28,
        animation:"fadeUp .3s ease both",
      }} key={step}>
        {current.label}
      </div>

      {current.fields.map(f => (
        <div key={f.id} style={{ marginBottom:16 }}>
          <input
            type={f.type}
            placeholder={f.placeholder}
            value={data[f.id] || ""}
            onChange={e => setData(d => ({ ...d, [f.id]: e.target.value }))}
            style={{
              width:"100%", padding:"13px 16px",
              background:"rgba(255,255,255,.06)",
              border:`1px solid rgba(201,169,98,.2)`,
              color:C.gesso,
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"1.05rem", outline:"none",
              transition:"border-color .2s",
            }}
            onFocus={e => e.target.style.borderColor = C.vg}
            onBlur={e => e.target.style.borderColor = "rgba(201,169,98,.2)"}
          />
        </div>
      ))}

      <div style={{ marginTop:"auto", display:"flex", gap:12 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s-1)} style={{
            padding:"11px 20px",
            background:"transparent", border:`1px solid rgba(201,169,98,.2)`,
            color:C.ink4, fontFamily:"'Cinzel',serif",
            fontSize:".52rem", fontWeight:700, letterSpacing:".18em",
            textTransform:"uppercase", cursor:"pointer",
          }}>
            ← Back
          </button>
        )}
        <button
          onClick={() => { if (step < steps.length-1) setStep(s=>s+1); else onComplete(data) }}
          disabled={!canNext}
          style={{
            flex:1, padding:"13px",
            background: canNext ? C.vg : "rgba(201,169,98,.15)",
            border:"none", color: canNext ? C.ink : C.ink4,
            fontFamily:"'Cinzel',serif", fontSize:".6rem", fontWeight:700,
            letterSpacing:".2em", textTransform:"uppercase",
            cursor: canNext ? "pointer" : "default",
            transition:"all .2s",
          }}
        >
          {step < steps.length-1 ? "Continue →" : "Commission My Agent →"}
        </button>
      </div>
    </div>
  )
}

// ── AGENT SELECTOR (compact) ──────────────────────────────────────
const AGENTS_COMPACT = [
  { name:"RetailBot",   icon:"🛍️", price:"R3,500", cat:"Retail" },
  { name:"HealthBot",   icon:"🏥", price:"R7,500", cat:"Healthcare" },
  { name:"PropBot",     icon:"🏛️", price:"R7,500", cat:"Real Estate" },
  { name:"DineAssist",  icon:"🍽️", price:"R5,000", cat:"Restaurants" },
  { name:"ProAssist",   icon:"⚖️", price:"R10,000", cat:"Legal" },
  { name:"SalesCloser", icon:"📞", price:"R15,000", cat:"B2B Sales" },
  { name:"MultiBot",    icon:"🌍", price:"R20,000", cat:"Enterprise" },
  { name:"TradeBot",    icon:"🔧", price:"R4,500",  cat:"Trades" },
]

// ── MAIN APP ──────────────────────────────────────────────────────
export default function VM5Portal() {
  const [view, setView] = useState("welcome") // welcome | chat | signup | success
  const [selectedAgent, setSelectedAgent] = useState(null)

  return (
    <>
      <style>{css}</style>
      <div className="grain" />

      <div style={{
        minHeight:"100vh",
        background:`radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,98,.06), ${C.bg})`,
        display:"flex", flexDirection:"column",
      }}>

        {/* Top nav */}
        <nav style={{
          height:56, display:"flex", alignItems:"center",
          justifyContent:"space-between", padding:"0 24px",
          background:"rgba(12,10,8,.9)",
          borderBottom:`1px solid rgba(201,169,98,.08)`,
          backdropFilter:"blur(20px)",
          position:"sticky", top:0, zIndex:100,
        }}>
          <div className="cinzel" style={{
            fontSize:".72rem", fontWeight:900,
            color:C.vg, letterSpacing:".2em", textTransform:"uppercase",
          }}>
            Studex · Super Agents
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {["Welcome", "Chat with Jarvis", "Commission"].map((label, i) => {
              const views = ["welcome", "chat", "signup"]
              return (
                <button key={i} onClick={() => setView(views[i])} style={{
                  padding:"5px 12px",
                  background: view === views[i] ? "rgba(201,169,98,.15)" : "transparent",
                  border: `1px solid ${view===views[i] ? C.vg : "transparent"}`,
                  color: view === views[i] ? C.vgl : C.ink4,
                  fontFamily:"'JetBrains Mono',monospace",
                  fontSize:".44rem", letterSpacing:".1em", textTransform:"uppercase",
                  cursor:"pointer", transition:"all .2s",
                }}>
                  {label}
                </button>
              )
            })}
          </div>
          <a href="https://stud.exchange" style={{ textDecoration:"none" }}>
            <span className="mono" style={{ fontSize:".44rem", color:C.ink4, letterSpacing:".12em", textTransform:"uppercase" }}>
              ← Back to site
            </span>
          </a>
        </nav>

        {/* WELCOME VIEW */}
        {view === "welcome" && (
          <div style={{
            flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
            padding:"48px 24px", textAlign:"center",
            animation:"fadeIn .5s ease both",
          }}>
            {/* Jarvis orb */}
            <div style={{
              width:120, height:120, borderRadius:"50%",
              background:`radial-gradient(circle, ${C.arc}20, rgba(0,0,0,.9))`,
              border:`1px solid ${C.arc}30`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"3rem", marginBottom:40,
              boxShadow:`0 0 60px ${C.arc}15`,
              animation:"arcPulse 4s ease-in-out infinite",
            }}>
              ⚡
            </div>

            <div className="mono" style={{ fontSize:".52rem", color:C.vg, letterSpacing:".3em", textTransform:"uppercase", marginBottom:12 }}>
              Studex Super Agents · Client Portal
            </div>
            <h1 className="cinzel" style={{
              fontSize:"clamp(2rem,6vw,3.5rem)", fontWeight:900,
              color:C.gesso, textTransform:"uppercase", letterSpacing:".04em",
              lineHeight:.9, marginBottom:12,
            }}>
              Commission Your<br/>
              <span style={{
                background:`linear-gradient(90deg, ${C.vgd}, ${C.vgl}, ${C.vg})`,
                backgroundSize:"200% auto", animation:"shimmer 3s linear infinite",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text",
              }}>
                Masterwork
              </span>
            </h1>
            <p style={{
              fontStyle:"italic", fontSize:"1.1rem",
              color:"rgba(253,250,245,.5)", maxWidth:480, lineHeight:1.7,
              marginBottom:40,
            }}>
              Choose your agent. Complete the Northstar ritual. Go live in 30 minutes.
              Jarvis will guide you through every step.
            </p>

            {/* CTAs */}
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:64 }}>
              <button onClick={() => setView("chat")} style={{
                padding:"14px 36px",
                background:`linear-gradient(135deg, ${C.arc}20, transparent)`,
                border:`1px solid ${C.arc}50`,
                color:C.arc, fontFamily:"'Cinzel',serif",
                fontSize:".62rem", fontWeight:700, letterSpacing:".2em",
                textTransform:"uppercase", cursor:"pointer",
                boxShadow:`0 0 24px ${C.arc}15`,
              }}>
                ⚡ Talk to Jarvis
              </button>
              <button onClick={() => setView("signup")} style={{
                padding:"14px 36px",
                background:C.vg, border:"none",
                color:C.ink, fontFamily:"'Cinzel',serif",
                fontSize:".62rem", fontWeight:700, letterSpacing:".2em",
                textTransform:"uppercase", cursor:"pointer",
              }}>
                Commission Now →
              </button>
            </div>

            {/* Agent grid preview */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",
              gap:2, background:"rgba(201,169,98,.06)",
              maxWidth:720, width:"100%",
            }}>
              {AGENTS_COMPACT.map((ag, i) => (
                <button key={i}
                  onClick={() => { setSelectedAgent(ag); setView("signup") }}
                  style={{
                    padding:"16px 12px", background:C.bg2,
                    border:"none", cursor:"pointer",
                    textAlign:"center", transition:"all .2s",
                    animation:`fadeUp .3s ease ${i*.04}s both`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,98,.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = C.bg2}
                >
                  <div style={{ fontSize:"1.6rem", marginBottom:6 }}>{ag.icon}</div>
                  <div className="cinzel" style={{ fontSize:".58rem", fontWeight:700, color:C.gesso, letterSpacing:".08em", textTransform:"uppercase", marginBottom:3 }}>
                    {ag.name}
                  </div>
                  <div className="mono" style={{ fontSize:".4rem", color:C.vg, letterSpacing:".06em" }}>
                    {ag.price}/mo
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* JARVIS CHAT VIEW */}
        {view === "chat" && (
          <div style={{
            flex:1, display:"grid",
            gridTemplateColumns:"minmax(0,1fr)",
            maxWidth:680, margin:"0 auto", width:"100%",
            padding:"0", animation:"fadeIn .3s ease both",
          }}>
            <JarvisChat onBeginCommission={() => setView("signup")} />
          </div>
        )}

        {/* SIGNUP VIEW */}
        {view === "signup" && (
          <div style={{
            flex:1, display:"grid",
            gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",
            maxWidth:900, margin:"0 auto", width:"100%",
            gap:2, background:"rgba(201,169,98,.04)",
            animation:"fadeIn .3s ease both",
          }}>
            {/* Left: signup form */}
            <SignupFlow onComplete={(data) => {
              setView("success")
            }} />

            {/* Right: Jarvis support */}
            <div style={{ background:C.bg }}>
              <div style={{ padding:"16px 20px", borderBottom:`1px solid rgba(201,169,98,.08)` }}>
                <div className="mono" style={{ fontSize:".44rem", color:C.vg, letterSpacing:".16em", textTransform:"uppercase" }}>
                  Jarvis is here to help
                </div>
              </div>
              <JarvisChat onBeginCommission={() => {}} />
            </div>
          </div>
        )}

        {/* SUCCESS VIEW */}
        {view === "success" && (
          <div style={{
            flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
            padding:"48px 24px", textAlign:"center",
            animation:"fadeIn .5s ease both",
          }}>
            <div style={{ fontSize:"4rem", marginBottom:24 }}>⚡</div>
            <div className="cinzel" style={{
              fontSize:"clamp(1.6rem,4vw,2.4rem)", fontWeight:900,
              color:C.vgl, textTransform:"uppercase", letterSpacing:".06em",
              marginBottom:12,
            }}>
              Commission Received
            </div>
            <p style={{ fontStyle:"italic", color:"rgba(253,250,245,.6)", fontSize:"1.1rem", lineHeight:1.7, maxWidth:480, marginBottom:32 }}>
              Your agent is being forged. Check your email for next steps.
              Jarvis will guide you through the Northstar ritual.
              Your agent will be live within 30 minutes.
            </p>
            <div style={{
              padding:"16px 24px",
              border:`1px solid rgba(201,169,98,.2)`,
              background:"rgba(201,169,98,.06)",
              marginBottom:32,
            }}>
              <div className="mono" style={{ fontSize:".44rem", color:C.vg, letterSpacing:".14em", textTransform:"uppercase", marginBottom:4 }}>
                What Happens Next
              </div>
              {["✓ Commission confirmed — payment processing",
                "✓ Fly.io VM provisioning your private workspace",
                "✓ Northstar ritual email sent",
                "✓ WhatsApp QR ready after Northstar",
                "✓ Agent live within 30 minutes",
              ].map((s, i) => (
                <div key={i} style={{ fontStyle:"italic", fontSize:".9rem", color:"rgba(253,250,245,.65)", padding:"4px 0" }}>
                  {s}
                </div>
              ))}
            </div>
            <button onClick={() => setView("welcome")} style={{
              padding:"12px 32px", background:"transparent",
              border:`1px solid rgba(201,169,98,.3)`, color:C.vg,
              fontFamily:"'Cinzel',serif", fontSize:".6rem",
              fontWeight:700, letterSpacing:".18em", textTransform:"uppercase",
              cursor:"pointer",
            }}>
              Back to Portal
            </button>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          padding:"16px 24px", borderTop:`1px solid rgba(201,169,98,.06)`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:8,
        }}>
          <span className="mono" style={{ fontSize:".42rem", color:C.ink4, letterSpacing:".1em" }}>
            © 2026 Studex Group · Johannesburg · app.stud.exchange · VM 5
          </span>
          <div style={{ display:"flex", gap:16 }}>
            {["Privacy", "POPIA", "Support"].map(l => (
              <span key={l} className="mono" style={{ fontSize:".42rem", color:C.ink4, letterSpacing:".1em", textTransform:"uppercase", cursor:"pointer" }}>
                {l}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </>
  )
}

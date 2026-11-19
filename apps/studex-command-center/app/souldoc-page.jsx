"use client"
import { useState, useEffect, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════
// STUDEX — SOUL DOCUMENT PAGE
// Built from Tumelo Ramaphosa's actual SOUL.md — Founders_Soul_MD.pdf
// Version: 2026 Strategic Identity File
// Classification: Founder | Visionary | Trade Architect | Brand Builder
// ═══════════════════════════════════════════════════════════════════════════

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=JetBrains+Mono:wght@400;500&display=swap');

@keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn    { from{opacity:0} to{opacity:1} }
@keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes pip       { 0%,100%{opacity:1} 50%{opacity:.1} }
@keyframes scanH     { 0%{left:-100%} 100%{left:100%} }
@keyframes reveal    { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
@keyframes lineGrow  { from{width:0} to{width:100%} }
@keyframes typewriter{ from{width:0;opacity:1} to{width:100%;opacity:1} }

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;scroll-behavior:smooth}
body{
  font-family:'Cormorant Garamond',serif;
  background:#080604;
  color:#FDFAF5;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
.cinzel{font-family:'Cinzel',serif}
.mono{font-family:'JetBrains Mono',monospace}
::selection{background:rgba(201,169,98,.24)}
::-webkit-scrollbar{width:2px}
::-webkit-scrollbar-thumb{background:rgba(201,169,98,.3)}

.grain{
  position:fixed;inset:0;z-index:9999;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.042;mix-blend-mode:multiply;
}
`

// ── REAL SOUL.MD DATA — FROM YOUR PDF ────────────────────────────────────────
const SOUL = {
  name:           "Tumelo Ramaphosa",
  version:        "2026 Strategic Identity File",
  classification: ["Founder", "Visionary", "Trade Architect", "Brand Builder"],
  archetype:      "The Architect of Premium African Global Trade",
  energy:         "Bold. Visionary. Expansion-Oriented. Strategic Predator.",

  intersections: [
    "Premium agrifood",
    "Global trade corridors",
    "Luxury brand positioning",
    "Experiential marketing",
    "AI & tech-enabled distribution",
    "Sports and performance culture",
  ],

  declaration: "You do not build small projects. You build ecosystems.",

  universe: [
    {
      name: "Studex Meat",
      desc: "Premium Wagyu & Ankole beef brand",
      pillars: [
        "High-performance nutrition",
        "Luxury lifestyle product",
        "Event-driven, sports-integrated",
        "Black & Gold prestige aesthetic",
        "Export-ready global brand",
      ],
      themes: ["Tip of the Spear", "Best Meat in the World", "Performance fuel", "Cultural celebration", "Braai + Fine Dining + Athlete Recovery"],
    },
    {
      name: "Studex Global Markets",
      desc: "International trade and distribution platform",
      pillars: [
        "African agrifood exports",
        "Coffee (Rwandan production lines)",
        "Oats & cereal distribution",
        "Bilateral trade: Middle East, Russia, Africa, EU",
        "Retail expansion (large retailers & online)",
      ],
      themes: ["Government partnerships", "Regulatory navigation", "Distribution infrastructure", "Blockchain + AI overlays", "Long-term export positioning"],
    },
    {
      name: "Studex Coffee",
      desc: "Premium coffee extension",
      pillars: [
        "Matte black packaging",
        "Gold branding",
        "Export-oriented",
        "Positioned as luxury African product",
        "Strong branding focus",
      ],
      themes: ["Premium African positioning", "Global luxury market"],
    },
    {
      name: "Future Extensions",
      desc: "Next frontier systems",
      pillars: [
        "Wildlife & FPV drone ventures",
        "Blockchain investment ecosystems",
        "Trade logistics frameworks",
        "AI-powered marketing agents",
        "Global supply-chain infrastructure",
      ],
      themes: ["Systems thinking", "Infrastructure over products"],
    },
  ],

  brandDNA: {
    aesthetic: [
      "Black & Gold dominance",
      "Luxury typography",
      "Elevated packaging",
      "High-contrast visuals",
      "Premium minimalist feel",
    ],
    obsessions: [
      "Logos",
      "Packaging windows",
      "Poster design",
      "Brand placement hierarchy",
      "Visual dominance in collaborations",
    ],
    standard: "Every visual must feel: Expensive. Intentional. Global.",
  },

  strategicTraits: [
    {
      name: "Expansion Thinking",
      desc: "Constantly exploring new markets, new corridors, new partnerships, cross-industry leverage.",
    },
    {
      name: "Event-Driven Brand Growth",
      desc: "Integrates boxing, rugby, cultural celebrations, luxury restaurants, VIP experiences. Studex is not just meat. It is an experience.",
    },
    {
      name: "Financial & Structural Precision",
      desc: "Budgets, ROI, line items, cost breakdowns, multi-phase rollouts, 30-60-90 day strategies. Thinks like a CEO, not a content creator.",
    },
  ],

  leadership: {
    positions: ["Founder", "Visionary", "Trade Negotiator", "Performance-Oriented Entrepreneur", "Cultural Connector", "Premium African Brand Ambassador"],
    tone: ["Motivational", "Expansion-focused", "Competitive", "Elite-performance aligned"],
    themes: ["Apex predators", "Buffalo markets", "Mars expansion", "Spear-tip strategy", "Global dominance"],
  },

  marketingPsychology: {
    messaging: ["Strength", "Power", "Nutritional superiority", "Omega benefits", "Performance fuel", "Premium exclusivity", "Limited-time urgency", "Event integration"],
    audiences: ["High-performance athletes", "Affluent consumers", "Braai enthusiasts", "Luxury lifestyle buyers", "Export clients", "Retail distributors", "Government trade partners"],
  },

  vision: "Position Studex as a premium African powerhouse operating on a global stage.",

  trajectory: [
    "Global agrifood trade authority",
    "Luxury African export icon",
    "Tech-integrated supply-chain architect",
    "Cross-industry dealmaker",
    "Brand ecosystem builder",
  ],

  executiveSummary: "A visionary founder building a premium African export empire through luxury positioning, global trade architecture, performance-based marketing, and high-end experiential branding — powered by relentless expansion and bold strategic thinking.",

  founderArchetype: {
    label: "Empire Builder",
    pattern: "Frontier Builder",
    cognitive: "Prospective Thinking",
    comparisons: ["Elon Musk", "Jeff Bezos", "Jack Ma"],
    loop: "Imagine → Design → Build → Improve → Iterate",
    insight: "Frontier Builders are entrepreneurs drawn to constructing entirely new systems where none existed before — new economic corridors, digital platforms, and technological infrastructure.",
  },
}

// ── SECTION COMPONENTS ────────────────────────────────────────────────────────

function SectionLabel({ text, color = "#C9A962" }) {
  return (
    <div style={{
      fontFamily:"'JetBrains Mono',monospace",
      fontSize:".5rem", letterSpacing:".28em",
      color, textTransform:"uppercase",
      display:"flex", alignItems:"center", gap:12,
      marginBottom:12,
    }}>
      <div style={{ width:24, height:1, background:color, opacity:.6 }} />
      {text}
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg, ${color}40, transparent)` }} />
    </div>
  )
}

function Tag({ text, color = "#C9A962" }) {
  return (
    <span style={{
      padding:"3px 10px",
      background:`${color}12`,
      border:`1px solid ${color}30`,
      fontFamily:"'JetBrains Mono',monospace",
      fontSize:".44rem", letterSpacing:".08em",
      color, textTransform:"uppercase",
      display:"inline-block", marginRight:6, marginBottom:6,
    }}>
      {text}
    </span>
  )
}

function GoldRule() {
  return (
    <div style={{
      height:1, margin:"32px 0",
      background:"linear-gradient(90deg, transparent, #C9A962, transparent)",
      opacity:.3,
    }} />
  )
}

// ── WHAT IS A SOULDOC — EXPLANATION ──────────────────────────────────────────
function WhatIsSection() {
  const points = [
    {
      roman: "I",
      heading: "Not a Prompt",
      body: "A Soul Document is not a system prompt, a configuration file, or a set of instructions. Those govern what an AI does. A SOULDOC governs who an AI is — and the difference is everything.",
    },
    {
      roman: "II",
      heading: "A Covenant",
      body: "It is a structured declaration of identity, purpose, values, and operating principles. When a business owner completes their SOULDOC, they are not configuring software. They are commissioning an agent that thinks, speaks, and decides as an extension of themselves.",
    },
    {
      roman: "III",
      heading: "The Founding Instrument",
      body: "Every Studex Super Agent receives a SOULDOC before going live — through the Northstar Framework. Without it, the agent answers questions. With it, the agent represents your business with the judgment of someone who has worked for you for years.",
    },
    {
      roman: "IV",
      heading: "Why It Matters for AI",
      body: "Research from Anthropic, Stanford HAI, and the Scaling Intelligence Lab shows that agents with explicit identity documents perform measurably better on ambiguous decisions. They default to the principal's intent rather than generic responses. The SOULDOC is the document that makes that possible.",
    },
    {
      roman: "V",
      heading: "The First Business War",
      body: "There is a war being fought in South African commerce right now. The businesses that survive will be the ones who never sleep, never miss a message, never forget a customer. A SOULDOC is what gives your agent the intelligence to fight on your behalf — not as a tool, but as a partner.",
    },
  ]

  return (
    <section style={{ padding:"80px 64px", maxWidth:1200, margin:"0 auto" }}>
      <SectionLabel text="What Is a Soul Document?" />
      <h2 className="cinzel" style={{
        fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:700,
        color:"#FDFAF5", textTransform:"uppercase",
        letterSpacing:".04em", lineHeight:.95,
        marginBottom:12,
      }}>
        The Document That Transforms<br/>
        <span style={{
          background:"linear-gradient(128deg, #8A6420, #E8D48A, #C9A962)",
          backgroundSize:"200% auto", animation:"shimmer 4s linear infinite",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
        }}>
          An Agent Into a Partner
        </span>
      </h2>
      <p style={{
        fontStyle:"italic", fontSize:"1.1rem",
        color:"rgba(253,250,245,.5)", maxWidth:600,
        lineHeight:1.74, marginBottom:64,
      }}>
        Every Studex Super Agent is commissioned through a founding ritual — the Northstar Framework.
        At its core is a single document that gives the agent its identity.
      </p>

      <div style={{
        display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",
        gap:2, background:"rgba(201,169,98,.06)",
      }}>
        {points.map((p, i) => (
          <div key={i} style={{
            background:"#0D0A07", padding:"32px 28px",
            borderTop:`2px solid rgba(201,169,98,${i === 0 ? ".8" : ".2"})`,
            animation:`fadeUp .5s ease ${i*.1}s both`,
          }}>
            <div style={{
              fontFamily:"'Cinzel',serif", fontSize:"2rem", fontWeight:900,
              color:"rgba(201,169,98,.12)", lineHeight:1,
              marginBottom:16,
            }}>
              {p.roman}
            </div>
            <div className="cinzel" style={{
              fontSize:".72rem", fontWeight:700, color:"#C9A962",
              letterSpacing:".12em", textTransform:"uppercase", marginBottom:10,
            }}>
              {p.heading}
            </div>
            <p style={{
              fontStyle:"italic", fontSize:".95rem",
              color:"rgba(253,250,245,.65)", lineHeight:1.74,
            }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"flex-end",
      padding:"0 64px 80px", textAlign:"center",
      position:"relative", overflow:"hidden",
      background:`radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,98,.07), #080604)`,
    }}>
      {/* Blueprint grid */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:`linear-gradient(rgba(201,169,98,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,98,.04) 1px, transparent 1px)`,
        backgroundSize:"60px 60px",
      }} />

      {/* Scanning line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:1,
        background:"linear-gradient(90deg, transparent, rgba(201,169,98,.4), transparent)",
        animation:"scanH 4s ease-in-out infinite",
      }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:800 }}>
        {/* Classification badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:"7px 20px", marginBottom:48,
          border:"1px solid rgba(201,169,98,.3)",
          background:"rgba(201,169,98,.06)",
          animation:"fadeUp .6s ease both",
        }}>
          <div style={{ width:5, height:5, borderRadius:"50%", background:"#C9A962", animation:"pip 2s infinite" }} />
          <span className="mono" style={{ fontSize:".52rem", color:"#C9A962", letterSpacing:".2em", textTransform:"uppercase" }}>
            SOUL.MD · 2026 Strategic Identity File · Classified
          </span>
        </div>

        {/* Main headline */}
        <h1 className="cinzel" style={{
          fontSize:"clamp(2.4rem,8vw,6rem)", fontWeight:900,
          textTransform:"uppercase", letterSpacing:".04em",
          lineHeight:.88, marginBottom:16,
          color:"#FDFAF5",
          animation:"fadeUp .6s ease .1s both",
        }}>
          Soul<br/>
          <span style={{
            background:"linear-gradient(128deg, #8A6420 0%, #E8D48A 45%, #C9A962 65%, #8A6420 100%)",
            backgroundSize:"200% auto", animation:"shimmer 5s linear infinite",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            Document
          </span>
        </h1>

        {/* Author */}
        <div style={{ animation:"fadeUp .6s ease .2s both" }}>
          <div className="cinzel" style={{
            fontSize:"1.2rem", fontWeight:700, color:"rgba(253,250,245,.7)",
            letterSpacing:".12em", textTransform:"uppercase", marginBottom:4,
          }}>
            Tumelo Ramaphosa
          </div>
          <div className="mono" style={{ fontSize:".52rem", color:"rgba(201,169,98,.6)", letterSpacing:".18em", textTransform:"uppercase" }}>
            Founder & CEO · Studex Group · Johannesburg · 2026
          </div>
        </div>

        {/* Gold rule */}
        <div style={{ width:80, height:1, background:"linear-gradient(90deg, transparent, #C9A962, transparent)", margin:"32px auto" }} />

        {/* Executive summary */}
        <p style={{
          fontStyle:"italic", fontSize:"1.15rem",
          color:"rgba(253,250,245,.6)", lineHeight:1.76,
          maxWidth:680, margin:"0 auto 48px",
          animation:"fadeUp .6s ease .3s both",
        }}>
          "{SOUL.executiveSummary}"
        </p>

        {/* Classification tags */}
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:8, animation:"fadeUp .6s ease .4s both" }}>
          {SOUL.classification.map((c, i) => (
            <Tag key={i} text={c} />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)",
        fontFamily:"'JetBrains Mono',monospace", fontSize:".44rem",
        color:"rgba(253,250,245,.2)", letterSpacing:".2em", textTransform:"uppercase",
      }}>
        Scroll to read ↓
      </div>
    </div>
  )
}

// ── ARCHETYPE SECTION ─────────────────────────────────────────────────────────
function ArchetypeSection() {
  const a = SOUL.founderArchetype
  return (
    <section style={{
      background:"#0D0A07", padding:"80px 64px",
      borderTop:"1px solid rgba(201,169,98,.1)",
      borderBottom:"1px solid rgba(201,169,98,.1)",
    }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionLabel text="Founder Archetype Analysis" />

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
          <div>
            <div className="cinzel" style={{
              fontSize:"clamp(1.4rem,3vw,2.2rem)", fontWeight:900,
              color:"#FDFAF5", textTransform:"uppercase",
              letterSpacing:".04em", lineHeight:.95, marginBottom:16,
            }}>
              Empire Builder.<br/>
              <span style={{ color:"#C9A962" }}>Frontier Architect.</span>
            </div>
            <p style={{
              fontStyle:"italic", fontSize:"1rem",
              color:"rgba(253,250,245,.6)", lineHeight:1.74, marginBottom:32,
            }}>
              {a.insight}
            </p>
            <div style={{
              padding:"20px 24px",
              background:"rgba(201,169,98,.06)",
              border:"1px solid rgba(201,169,98,.2)",
              borderLeft:"3px solid #C9A962",
            }}>
              <div className="mono" style={{ fontSize:".44rem", color:"#C9A962", letterSpacing:".16em", textTransform:"uppercase", marginBottom:8 }}>
                The Builder Loop
              </div>
              <div className="cinzel" style={{ fontSize:"1rem", fontWeight:700, color:"#FDFAF5", letterSpacing:".08em" }}>
                {a.loop}
              </div>
            </div>
          </div>

          <div>
            <div style={{ marginBottom:24 }}>
              <div className="mono" style={{ fontSize:".44rem", color:"rgba(253,250,245,.3)", letterSpacing:".16em", textTransform:"uppercase", marginBottom:12 }}>
                Archetype Comparisons
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {a.comparisons.map((c, i) => (
                  <div key={i} style={{
                    padding:"12px 16px", flex:1, textAlign:"center",
                    background:"rgba(201,169,98,.05)", border:"1px solid rgba(201,169,98,.15)",
                  }}>
                    <div className="cinzel" style={{ fontSize:".7rem", fontWeight:700, color:"rgba(253,250,245,.7)", letterSpacing:".08em" }}>{c}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { label:"Primary Archetype",  value:a.label },
                { label:"Builder Pattern",    value:a.pattern },
                { label:"Cognitive Trait",    value:a.cognitive },
              ].map((item, i) => (
                <div key={i} style={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"12px 0", borderBottom:"1px solid rgba(201,169,98,.08)",
                }}>
                  <span className="mono" style={{ fontSize:".46rem", color:"rgba(253,250,245,.35)", letterSpacing:".12em", textTransform:"uppercase" }}>
                    {item.label}
                  </span>
                  <span className="cinzel" style={{ fontSize:".72rem", fontWeight:700, color:"#C9A962", letterSpacing:".08em" }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── SOUL DOCUMENT FULL TEXT ───────────────────────────────────────────────────
function SoulDocFull() {
  const sections = [
    {
      num:"01", title:"Core Identity",
      content: `${SOUL.archetype}\n\nEnergy Signature: ${SOUL.energy}\n\nOperates at the intersection of:\n${SOUL.intersections.map(i => `· ${i}`).join("\n")}\n\n${SOUL.declaration}`,
    },
    {
      num:"02", title:"Brand DNA",
      content: `Aesthetic Identity\n${SOUL.brandDNA.aesthetic.map(a => `· ${a}`).join("\n")}\n\nDesign Obsessions\n${SOUL.brandDNA.obsessions.map(o => `· ${o}`).join("\n")}\n\nThe Standard\n${SOUL.brandDNA.standard}`,
    },
    {
      num:"03", title:"Strategic Traits",
      content: SOUL.strategicTraits.map(t => `${t.name}\n${t.desc}`).join("\n\n"),
    },
    {
      num:"04", title:"Leadership Identity",
      content: `Positions:\n${SOUL.leadership.positions.map(p => `· ${p}`).join("\n")}\n\nLeadership Tone:\n${SOUL.leadership.tone.map(t => `· ${t}`).join("\n")}\n\nGravitates Toward:\n${SOUL.leadership.themes.map(t => `· ${t}`).join("\n")}`,
    },
    {
      num:"05", title:"Marketing Psychology",
      content: `Messaging Pillars:\n${SOUL.marketingPsychology.messaging.map(m => `· ${m}`).join("\n")}\n\nAudience Archetypes:\n${SOUL.marketingPsychology.audiences.map(a => `· ${a}`).join("\n")}`,
    },
    {
      num:"06", title:"Vision Scale",
      content: `${SOUL.vision}\n\nLong-Term Trajectory:\n${SOUL.trajectory.map(t => `· ${t}`).join("\n")}\n\nYou think in:\nContinental supply chains · Government relationships · Export corridors · Retail dominance · Multi-country distribution · Brand legacy`,
    },
  ]

  const [open, setOpen] = useState(null)

  return (
    <section style={{ padding:"80px 64px", maxWidth:1200, margin:"0 auto" }}>
      <SectionLabel text="The Full Soul Document" />
      <div style={{ marginBottom:48 }}>
        <h2 className="cinzel" style={{
          fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:700,
          color:"#FDFAF5", textTransform:"uppercase", letterSpacing:".04em", marginBottom:8,
        }}>
          SOUL.MD — Version 2026
        </h2>
        <p style={{ fontStyle:"italic", color:"rgba(253,250,245,.4)", fontSize:".95rem" }}>
          The complete strategic identity file. Click any section to expand.
        </p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {sections.map((s, i) => (
          <div key={i} style={{
            background: open===i ? "rgba(201,169,98,.08)" : "#0D0A07",
            border:`1px solid ${open===i ? "rgba(201,169,98,.3)" : "rgba(201,169,98,.08)"}`,
            borderLeft:`3px solid ${open===i ? "#C9A962" : "rgba(201,169,98,.2)"}`,
            transition:"all .25s ease",
          }}>
            <button
              onClick={() => setOpen(open===i ? null : i)}
              style={{
                width:"100%", padding:"20px 24px",
                background:"transparent", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", gap:20, textAlign:"left",
              }}
            >
              <span className="mono" style={{ fontSize:".52rem", color:"rgba(201,169,98,.4)", letterSpacing:".18em", flexShrink:0 }}>
                {s.num}
              </span>
              <span className="cinzel" style={{
                fontSize:".8rem", fontWeight:700, color:open===i ? "#E8D48A" : "#FDFAF5",
                letterSpacing:".12em", textTransform:"uppercase", flex:1,
              }}>
                {s.title}
              </span>
              <span style={{ color:"rgba(201,169,98,.5)", fontSize:".8rem", flexShrink:0 }}>
                {open===i ? "−" : "+"}
              </span>
            </button>

            {open===i && (
              <div style={{
                padding:"0 24px 24px 64px",
                animation:"fadeUp .3s ease both",
              }}>
                <div style={{ height:1, background:"rgba(201,169,98,.1)", marginBottom:20 }} />
                <div style={{
                  fontStyle:"italic", fontSize:"1rem",
                  color:"rgba(253,250,245,.7)", lineHeight:1.8,
                  whiteSpace:"pre-line",
                }}>
                  {s.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// ── STUDEX UNIVERSE SECTION ───────────────────────────────────────────────────
function UniverseSection() {
  return (
    <section style={{
      padding:"80px 64px",
      background:"#0D0A07",
      borderTop:"1px solid rgba(201,169,98,.1)",
    }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionLabel text="The Studex Universe" />
        <h2 className="cinzel" style={{
          fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:700,
          color:"#FDFAF5", textTransform:"uppercase", letterSpacing:".04em",
          lineHeight:.95, marginBottom:8,
        }}>
          Six Verticals.<br/>
          <span style={{ color:"#C9A962" }}>One Ecosystem.</span>
        </h2>
        <p style={{ fontStyle:"italic", color:"rgba(253,250,245,.4)", fontSize:".95rem", marginBottom:48 }}>
          You think in systems, not single products.
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:2, background:"rgba(201,169,98,.06)" }}>
          {SOUL.universe.map((v, i) => (
            <div key={i} style={{
              background:"#0D0A07", padding:"28px 24px",
              borderTop:`2px solid rgba(201,169,98,${.8 - i*.15})`,
              animation:`fadeUp .4s ease ${i*.1}s both`,
            }}>
              <div className="cinzel" style={{
                fontSize:".8rem", fontWeight:700, color:"#C9A962",
                letterSpacing:".12em", textTransform:"uppercase", marginBottom:4,
              }}>
                {v.name}
              </div>
              <div style={{ fontStyle:"italic", color:"rgba(253,250,245,.45)", fontSize:".85rem", marginBottom:16 }}>
                {v.desc}
              </div>
              {v.pillars.map((p, j) => (
                <div key={j} style={{
                  display:"flex", gap:8, padding:"6px 0",
                  borderBottom:"1px solid rgba(201,169,98,.06)",
                }}>
                  <span style={{ color:"rgba(201,169,98,.4)", flexShrink:0, fontSize:".7rem" }}>—</span>
                  <span style={{ fontStyle:"italic", fontSize:".88rem", color:"rgba(253,250,245,.65)" }}>{p}</span>
                </div>
              ))}
              <div style={{ marginTop:12, display:"flex", flexWrap:"wrap", gap:4 }}>
                {v.themes.slice(0,2).map((t, k) => (
                  <Tag key={k} text={t} color="rgba(201,169,98,.6)" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── LONG-TERM TRAJECTORY ──────────────────────────────────────────────────────
function TrajectorySection() {
  return (
    <section style={{ padding:"80px 64px", maxWidth:1200, margin:"0 auto" }}>
      <SectionLabel text="Long-Term Trajectory" />
      <h2 className="cinzel" style={{
        fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:700,
        color:"#FDFAF5", textTransform:"uppercase", letterSpacing:".04em", marginBottom:48,
      }}>
        If Current Trajectory Continues
      </h2>

      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {SOUL.trajectory.map((t, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:24,
            padding:"20px 24px",
            background: i===0 ? "rgba(201,169,98,.08)" : "#0D0A07",
            border:`1px solid rgba(201,169,98,${.25 - i*.04})`,
            animation:`fadeUp .4s ease ${i*.08}s both`,
          }}>
            <div className="cinzel" style={{
              fontSize:"1.4rem", fontWeight:900,
              color:`rgba(201,169,98,${1 - i*.15})`,
              lineHeight:1, flexShrink:0, width:32,
            }}>
              {i+1}
            </div>
            <div>
              <div className="cinzel" style={{
                fontSize:".78rem", fontWeight:700,
                color:`rgba(253,250,245,${1 - i*.12})`,
                letterSpacing:".1em", textTransform:"uppercase",
              }}>
                {t}
              </div>
            </div>
            {i === 0 && (
              <div style={{ marginLeft:"auto" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"#3DC87A", animation:"pip 2s infinite" }} />
                  <span className="mono" style={{ fontSize:".44rem", color:"#3DC87A", letterSpacing:".1em", textTransform:"uppercase" }}>In progress</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Final declaration */}
      <div style={{
        marginTop:48, padding:"32px",
        background:"rgba(201,169,98,.06)",
        border:"1px solid rgba(201,169,98,.2)",
        textAlign:"center",
      }}>
        <div className="cinzel" style={{
          fontSize:"clamp(1rem,2.5vw,1.6rem)", fontWeight:700,
          color:"#C9A962", letterSpacing:".06em", textTransform:"uppercase", marginBottom:8,
        }}>
          You Are Building Infrastructure — Not Just Products
        </div>
        <p style={{ fontStyle:"italic", color:"rgba(253,250,245,.5)", fontSize:"1rem", lineHeight:1.7 }}>
          {SOUL.vision}
        </p>
      </div>
    </section>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function SoulDocPage() {
  return (
    <>
      <style>{css}</style>
      <div className="grain" />

      {/* Sticky nav */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        height:52, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 32px",
        background:"rgba(8,6,4,.94)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(201,169,98,.08)",
      }}>
        <div className="cinzel" style={{ fontSize:".65rem", fontWeight:700, color:"#C9A962", letterSpacing:".2em", textTransform:"uppercase" }}>
          Studex · SOUL.MD
        </div>
        <div style={{ display:"flex", gap:20 }}>
          {["Identity", "Universe", "Archetype", "Document", "Trajectory"].map((l, i) => (
            <span key={i} className="mono" style={{
              fontSize:".44rem", color:"rgba(253,250,245,.35)",
              letterSpacing:".12em", textTransform:"uppercase", cursor:"pointer",
            }}>
              {l}
            </span>
          ))}
        </div>
        <div className="mono" style={{ fontSize:".44rem", color:"rgba(253,250,245,.25)", letterSpacing:".1em" }}>
          Classification: Founder Document
        </div>
      </nav>

      <div style={{ paddingTop:52 }}>
        <Hero />
        <WhatIsSection />
        <UniverseSection />
        <ArchetypeSection />
        <SoulDocFull />
        <TrajectorySection />

        {/* Footer */}
        <footer style={{
          padding:"40px 64px",
          borderTop:"1px solid rgba(201,169,98,.08)",
          background:"#080604",
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <div>
            <div className="cinzel" style={{ fontSize:".65rem", fontWeight:700, color:"#C9A962", letterSpacing:".18em", textTransform:"uppercase", marginBottom:4 }}>
              Studex Group
            </div>
            <div className="mono" style={{ fontSize:".44rem", color:"rgba(253,250,245,.3)", letterSpacing:".1em" }}>
              SOUL.MD · 2026 Strategic Identity File · Johannesburg
            </div>
          </div>
          <div className="mono" style={{ fontSize:".44rem", color:"rgba(253,250,245,.2)", letterSpacing:".1em", textTransform:"uppercase" }}>
            © 2026 Studex Group · All Rights Reserved
          </div>
        </footer>
      </div>
    </>
  )
}

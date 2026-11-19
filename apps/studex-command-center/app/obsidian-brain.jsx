"use client"
import { useState, useEffect, useRef, useMemo } from "react"

// Three.js via CDN — loaded dynamically
// This component renders a full 3D interactive Obsidian Brain sphere
// Each node = a memory. Connections = associations. Pulse = recent activity.

const BRAIN_DATA = {
  client: "The Butcher Shop",
  agent: "Naledi",
  totalMemories: 847,
  nodes: [
    // [label, theta, phi, size, category, recency]
    { id:1,  label:"Mrs Dlamini — ribeye, thin cut",      cat:"customer",  size:1.4, hot:true  },
    { id:2,  label:"Mr Patel — halaal only",              cat:"customer",  size:1.2, hot:false },
    { id:3,  label:"Wagyu biltong: 52g protein/70g",      cat:"product",   size:1.6, hot:true  },
    { id:4,  label:"Free delivery over R500",             cat:"policy",    size:1.3, hot:false },
    { id:5,  label:"Friday peak: ribeye sellout",         cat:"insight",   size:1.5, hot:true  },
    { id:6,  label:"Cart abandoned: 30min follow-up",     cat:"workflow",  size:1.1, hot:false },
    { id:7,  label:"Wagyu + droëwors bundle: R650",       cat:"product",   size:1.3, hot:true  },
    { id:8,  label:"NIHT Halaal certified",               cat:"cert",      size:1.0, hot:false },
    { id:9,  label:"Delivery zone: Johannesburg north",   cat:"logistics", size:1.2, hot:false },
    { id:10, label:"Instagram DM → WhatsApp bridge",      cat:"workflow",  size:1.4, hot:true  },
    { id:11, label:"Peak orders: Fri 6–9pm",              cat:"insight",   size:1.5, hot:false },
    { id:12, label:"Peri-peri biltong: limited stock",    cat:"product",   size:1.1, hot:true  },
    { id:13, label:"Sipho K. — weekly braai customer",    cat:"customer",  size:1.3, hot:false },
    { id:14, label:"Bulk order threshold: 20+ packs",     cat:"policy",    size:1.0, hot:false },
    { id:15, label:"Biltong → droëwors upsell: 68% hit", cat:"insight",   size:1.6, hot:true  },
    { id:16, label:"Store hours: 6am–8pm",                cat:"policy",    size:1.1, hot:false },
    { id:17, label:"Competitor gap: Sunday delivery",     cat:"insight",   size:1.4, hot:false },
    { id:18, label:"WhatsApp broadcast list: 234 customers", cat:"channel", size:1.2, hot:true },
    { id:19, label:"Payment: Stitch EFT preferred",       cat:"payment",   size:1.1, hot:false },
    { id:20, label:"Mrs Okonkwo — birthday 12 June",      cat:"customer",  size:1.3, hot:true  },
  ]
}

const CAT_COLORS = {
  customer:  "#C9A962",  // Venetian gold
  product:   "#7A3820",  // Burnt sienna
  insight:   "#00D4FF",  // Arc blue
  workflow:  "#1E5038",  // Verdigris
  policy:    "#8A6420",  // Dark gold
  cert:      "#3DC87A",  // Green
  logistics: "#624C18",  // Umber
  channel:   "#9B59B6",  // Purple
  payment:   "#E67E22",  // Orange
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

@keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes pip       { 0%,100%{opacity:1} 50%{opacity:.15} }
@keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes pulse-ring{ 0%{transform:scale(.8);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
@keyframes typeIn    { from{width:0} to{width:100%} }

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Cormorant Garamond',serif;background:#080604;color:#FDFAF5;-webkit-font-smoothing:antialiased;overflow:hidden}
.cinzel{font-family:'Cinzel',serif}
.mono{font-family:'JetBrains Mono',monospace}

#brain-canvas{position:absolute;inset:0;cursor:grab}
#brain-canvas:active{cursor:grabbing}

.grain{
  position:fixed;inset:0;z-index:100;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.04;mix-blend-mode:multiply;
}
`

// ── THREE.JS BRAIN SPHERE ─────────────────────────────────────────────────
function BrainSphere({ onNodeSelect, selectedNode }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({})

  useEffect(() => {
    // Dynamically load Three.js
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
    script.onload = () => initThree()
    document.head.appendChild(script)

    return () => {
      if (stateRef.current.animId) cancelAnimationFrame(stateRef.current.animId)
      if (stateRef.current.renderer) stateRef.current.renderer.dispose()
    }
  }, [])

  const initThree = () => {
    const THREE = window.THREE
    const canvas = canvasRef.current
    if (!canvas) return

    const W = canvas.offsetWidth, H = canvas.offsetHeight

    // Scene
    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(60, W/H, .1, 1000)
    camera.position.z = 6
    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    stateRef.current.renderer = renderer

    // ── Sphere wireframe ──────────────────────────────────────────────
    const sphereGeo  = new THREE.SphereGeometry(2.8, 32, 32)
    const sphereMat  = new THREE.MeshBasicMaterial({
      color: 0xC9A962, wireframe:true, transparent:true, opacity:.06
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    scene.add(sphere)

    // Inner glow sphere
    const glowGeo = new THREE.SphereGeometry(2.75, 32, 32)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x0D0D0D, transparent:true, opacity:.85, side:THREE.BackSide
    })
    scene.add(new THREE.Mesh(glowGeo, glowMat))

    // Equatorial rings
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(2.82 + i*.08, 2.85 + i*.08, 64)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xC9A962, transparent:true, opacity:.08 - i*.02, side:THREE.DoubleSide
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI/2 + (i * Math.PI/8)
      scene.add(ring)
    }

    // ── Memory nodes (fibonacci sphere distribution) ──────────────────
    const nodeObjects = []
    const N = BRAIN_DATA.nodes.length
    const goldenRatio = (1 + Math.sqrt(5)) / 2

    BRAIN_DATA.nodes.forEach((mem, i) => {
      const theta = Math.acos(1 - 2*(i+.5)/N)
      const phi   = 2 * Math.PI * i / goldenRatio

      const r = 2.8
      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(theta)

      const col  = new THREE.Color(CAT_COLORS[mem.cat] || "#C9A962")
      const size = mem.size * .045

      // Node sphere
      const geo  = new THREE.SphereGeometry(size, 12, 12)
      const mat  = new THREE.MeshBasicMaterial({ color:col, transparent:true, opacity:.9 })
      const node = new THREE.Mesh(geo, mat)
      node.position.set(x, y, z)
      node.userData = { ...mem, origOpacity:.9, origScale:1 }
      scene.add(node)

      // Glow halo for hot nodes
      if (mem.hot) {
        const haloGeo = new THREE.SphereGeometry(size * 2.8, 8, 8)
        const haloMat = new THREE.MeshBasicMaterial({
          color:col, transparent:true, opacity:.15, side:THREE.BackSide
        })
        const halo = new THREE.Mesh(haloGeo, haloMat)
        halo.position.set(x, y, z)
        scene.add(halo)

        // Pulse ring — animated separately
        node.userData.isHot = true
        node.userData.pulsePhase = Math.random() * Math.PI * 2
      }
      nodeObjects.push(node)
    })
    stateRef.current.nodeObjects = nodeObjects

    // ── Connections between related nodes ─────────────────────────────
    const connections = [
      [0,2], [0,6], [0,14],   // Mrs Dlamini ↔ products
      [1,7],                   // Mr Patel ↔ halaal cert
      [4,10], [4,6],           // Friday insights
      [9,17],                  // Instagram ↔ broadcast
      [14,2], [14,6],          // Upsell insight ↔ products
    ]

    connections.forEach(([a, b]) => {
      if (!nodeObjects[a] || !nodeObjects[b]) return
      const points = [nodeObjects[a].position, nodeObjects[b].position]
      const geo    = new THREE.BufferGeometry().setFromPoints(points)
      const mat    = new THREE.LineBasicMaterial({
        color:0xC9A962, transparent:true, opacity:.08, linewidth:1
      })
      scene.add(new THREE.Line(geo, mat))
    })

    // ── Ambient particle field ─────────────────────────────────────────
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const r   = 3.2 + Math.random() * 1.5
      const th  = Math.random() * Math.PI
      const ph  = Math.random() * Math.PI * 2
      positions[i*3]   = r * Math.sin(th) * Math.cos(ph)
      positions[i*3+1] = r * Math.sin(th) * Math.sin(ph)
      positions[i*3+2] = r * Math.cos(th)
    }
    const partGeo = new THREE.BufferGeometry()
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const partMat = new THREE.PointsMaterial({ color:0xC9A962, size:.02, transparent:true, opacity:.3 })
    scene.add(new THREE.Points(partGeo, partMat))

    // ── Raycaster for click/hover ──────────────────────────────────────
    const raycaster = new THREE.Raycaster()
    const mouse     = new THREE.Vector2()

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
    }

    canvas.addEventListener("click", (e) => {
      getMousePos(e)
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(nodeObjects)
      if (hits.length > 0) {
        onNodeSelect(hits[0].object.userData)
      }
    })

    // ── Orbit controls (manual) ───────────────────────────────────────
    let isDragging = false, prevX = 0, prevY = 0
    let rotX = 0, rotY = 0, velX = 0, velY = 0

    canvas.addEventListener("mousedown", e => { isDragging=true; prevX=e.clientX; prevY=e.clientY })
    window.addEventListener("mouseup",   () => isDragging=false)
    window.addEventListener("mousemove", e => {
      if (!isDragging) return
      velX = (e.clientX - prevX) * .003
      velY = (e.clientY - prevY) * .003
      rotY += velX; rotX += velY
      prevX = e.clientX; prevY = e.clientY
    })

    // Touch support
    let lastTouchX = 0, lastTouchY = 0
    canvas.addEventListener("touchstart", e => { lastTouchX=e.touches[0].clientX; lastTouchY=e.touches[0].clientY })
    canvas.addEventListener("touchmove", e => {
      e.preventDefault()
      velX = (e.touches[0].clientX - lastTouchX) * .003
      velY = (e.touches[0].clientY - lastTouchY) * .003
      rotY += velX; rotX += velY
      lastTouchX=e.touches[0].clientX; lastTouchY=e.touches[0].clientY
    }, { passive:false })

    // ── Animation loop ────────────────────────────────────────────────
    let t = 0
    const animate = () => {
      stateRef.current.animId = requestAnimationFrame(animate)
      t += .008

      // Momentum decay
      if (!isDragging) { velX *= .95; velY *= .95; rotY += velX; rotX += velY }

      // Slow auto-rotation when idle
      if (Math.abs(velX) < .001 && Math.abs(velY) < .001 && !isDragging) {
        rotY += .0015
      }

      sphere.rotation.y = rotY
      sphere.rotation.x = rotX

      // Animate nodes
      nodeObjects.forEach((node, i) => {
        const phase = t + i * .3
        if (node.userData.isHot) {
          const pulse = Math.sin(phase + node.userData.pulsePhase)
          node.scale.setScalar(1 + pulse * .12)
          node.material.opacity = .85 + pulse * .15
        }
        // Slight float
        node.position.y = node.position.y + Math.sin(phase * .4 + i) * .0002
      })

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      const W2 = canvas.offsetWidth, H2 = canvas.offsetHeight
      camera.aspect = W2/H2; camera.updateProjectionMatrix()
      renderer.setSize(W2, H2)
    }
    window.addEventListener("resize", onResize)
  }

  return (
    <canvas
      ref={canvasRef}
      id="brain-canvas"
      style={{ width:"100%", height:"100%", display:"block" }}
    />
  )
}

// ── MEMORY LIST ────────────────────────────────────────────────────────────
function MemoryList({ onSelect, selected }) {
  const [filter, setFilter] = useState("all")
  const cats = ["all", ...Object.keys(CAT_COLORS)]

  const filtered = filter === "all"
    ? BRAIN_DATA.nodes
    : BRAIN_DATA.nodes.filter(n => n.cat === filter)

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* Filter */}
      <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(201,169,98,.1)", flexShrink:0 }}>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {cats.slice(0,5).map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding:"3px 8px", border:"none", cursor:"pointer",
              background: filter===c ? CAT_COLORS[c] || "#C9A962" : "rgba(201,169,98,.08)",
              color: filter===c ? "#080604" : "rgba(253,250,245,.5)",
              fontFamily:"'JetBrains Mono',monospace", fontSize:".42rem",
              letterSpacing:".08em", textTransform:"uppercase",
              transition:"all .15s",
            }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Memory entries */}
      <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
        {filtered.map((mem, i) => (
          <div key={mem.id}
            onClick={() => onSelect(mem)}
            style={{
              padding:"10px 16px", cursor:"pointer",
              background: selected?.id === mem.id ? "rgba(201,169,98,.1)" : "transparent",
              borderLeft: `2px solid ${selected?.id === mem.id ? CAT_COLORS[mem.cat] : "transparent"}`,
              transition:"all .15s",
              animation:`fadeUp .3s ease ${i*.02}s both`,
            }}
          >
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
              <div style={{
                width:6, height:6, borderRadius:"50%",
                background:CAT_COLORS[mem.cat],
                flexShrink:0,
                animation: mem.hot ? "pip 2s infinite" : "none",
              }} />
              <span style={{ fontStyle:"italic", fontSize:".85rem", color:"rgba(253,250,245,.75)", lineHeight:1.4 }}>
                {mem.label}
              </span>
            </div>
            <div style={{ marginLeft:14, display:"flex", gap:8, alignItems:"center" }}>
              <span style={{
                fontFamily:"'JetBrains Mono',monospace", fontSize:".4rem",
                color:CAT_COLORS[mem.cat], letterSpacing:".06em", textTransform:"uppercase",
              }}>
                {mem.cat}
              </span>
              {mem.hot && (
                <span style={{
                  fontFamily:"'JetBrains Mono',monospace", fontSize:".38rem",
                  color:"#3DC87A", letterSpacing:".06em", textTransform:"uppercase",
                  padding:"1px 5px", background:"rgba(61,200,122,.1)",
                }}>
                  recent
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── MAIN OBSIDIAN BRAIN PAGE ───────────────────────────────────────────────
export default function ObsidianBrain() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [showPanel, setShowPanel] = useState(true)

  const stats = [
    { label:"Total Memories",    value:BRAIN_DATA.totalMemories },
    { label:"Hot This Week",     value:BRAIN_DATA.nodes.filter(n=>n.hot).length },
    { label:"Categories",        value:Object.keys(CAT_COLORS).length },
    { label:"Connections",       value:"47" },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="grain" />

      <div style={{
        width:"100vw", height:"100vh",
        background:"#080604",
        position:"relative", overflow:"hidden",
        display:"flex",
      }}>
        {/* 3D Brain fills entire background */}
        <div style={{ position:"absolute", inset:0, zIndex:1 }}>
          <BrainSphere onNodeSelect={setSelectedNode} selectedNode={selectedNode} />
        </div>

        {/* Radial gradient overlay */}
        <div style={{
          position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
          background:"radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, #080604 100%)",
        }} />

        {/* Top HUD bar */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, zIndex:10,
          padding:"16px 32px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"linear-gradient(to bottom, rgba(8,6,4,.95), transparent)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#C9A962", animation:"pip 2s infinite" }} />
            <div>
              <div className="cinzel" style={{ fontSize:".7rem", fontWeight:700, color:"#C9A962", letterSpacing:".2em", textTransform:"uppercase" }}>
                Obsidian Brain
              </div>
              <div className="mono" style={{ fontSize:".44rem", color:"rgba(253,250,245,.4)", letterSpacing:".14em", textTransform:"uppercase" }}>
                {BRAIN_DATA.agent} · {BRAIN_DATA.client} · Second Memory
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:24 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div className="cinzel" style={{ fontSize:"1.1rem", fontWeight:700, color:"#C9A962", lineHeight:1 }}>
                  {s.value}
                </div>
                <div className="mono" style={{ fontSize:".38rem", color:"rgba(253,250,245,.35)", letterSpacing:".1em", textTransform:"uppercase", marginTop:2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setShowPanel(p => !p)} style={{
            background:"rgba(201,169,98,.1)", border:"1px solid rgba(201,169,98,.2)",
            color:"#C9A962", fontFamily:"'JetBrains Mono',monospace",
            fontSize:".44rem", letterSpacing:".12em", textTransform:"uppercase",
            padding:"6px 14px", cursor:"pointer",
          }}>
            {showPanel ? "Hide" : "Show"} Memory Index
          </button>
        </div>

        {/* Selected node detail — bottom center */}
        {selectedNode && (
          <div style={{
            position:"absolute", bottom:32, left:"50%",
            transform:"translateX(-50%)",
            zIndex:10, maxWidth:480, width:"90vw",
            padding:"20px 24px",
            background:"rgba(8,6,4,.92)",
            border:`1px solid ${CAT_COLORS[selectedNode.cat]}60`,
            borderTop:`2px solid ${CAT_COLORS[selectedNode.cat]}`,
            backdropFilter:"blur(20px)",
            animation:"fadeUp .3s ease both",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span className="mono" style={{ fontSize:".44rem", color:CAT_COLORS[selectedNode.cat], letterSpacing:".14em", textTransform:"uppercase" }}>
                {selectedNode.cat} · Memory Node #{selectedNode.id}
              </span>
              <button onClick={() => setSelectedNode(null)} style={{
                background:"none", border:"none", color:"rgba(253,250,245,.3)",
                cursor:"pointer", fontSize:".8rem",
              }}>✕</button>
            </div>
            <div style={{ fontStyle:"italic", fontSize:"1.1rem", color:"#FDFAF5", lineHeight:1.6 }}>
              {selectedNode.label}
            </div>
            {selectedNode.hot && (
              <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"#3DC87A", animation:"pip 1.5s infinite" }} />
                <span className="mono" style={{ fontSize:".42rem", color:"#3DC87A", letterSpacing:".1em", textTransform:"uppercase" }}>
                  Active this week — recently accessed
                </span>
              </div>
            )}
          </div>
        )}

        {/* Right panel — memory index */}
        {showPanel && (
          <div style={{
            position:"absolute", right:0, top:0, bottom:0,
            width:320, zIndex:10,
            background:"rgba(8,6,4,.88)",
            borderLeft:"1px solid rgba(201,169,98,.1)",
            backdropFilter:"blur(20px)",
            display:"flex", flexDirection:"column",
            paddingTop:64,
            animation:"fadeUp .3s ease both",
          }}>
            <div style={{ padding:"16px 16px 8px", flexShrink:0 }}>
              <div className="cinzel" style={{ fontSize:".65rem", fontWeight:700, color:"#C9A962", letterSpacing:".16em", textTransform:"uppercase", marginBottom:4 }}>
                Memory Index
              </div>
              <div style={{ fontStyle:"italic", fontSize:".8rem", color:"rgba(253,250,245,.4)" }}>
                Click any memory to locate on sphere
              </div>
            </div>

            <div style={{ flex:1, overflow:"hidden" }}>
              <MemoryList onSelect={setSelectedNode} selected={selectedNode} />
            </div>

            {/* Add memory */}
            <div style={{ padding:"16px", borderTop:"1px solid rgba(201,169,98,.1)", flexShrink:0 }}>
              <div className="mono" style={{ fontSize:".44rem", color:"rgba(253,250,245,.3)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>
                Brain grows automatically with every conversation
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{
                  flex:1, height:3,
                  background:"rgba(201,169,98,.1)", borderRadius:2, overflow:"hidden",
                }}>
                  <div style={{
                    height:"100%", borderRadius:2,
                    background:"linear-gradient(90deg, #8A6420, #E8D48A)",
                    width:"64%",
                    animation:"shimmer 3s linear infinite",
                    backgroundSize:"200% auto",
                  }} />
                </div>
                <span className="mono" style={{ fontSize:".44rem", color:"#C9A962" }}>64%</span>
              </div>
              <div className="mono" style={{ fontSize:".4rem", color:"rgba(253,250,245,.3)", marginTop:4 }}>
                3.2M / 5M tokens used
              </div>
            </div>
          </div>
        )}

        {/* Bottom left — interaction hint */}
        <div style={{
          position:"absolute", bottom:24, left:32, zIndex:10,
          pointerEvents:"none",
        }}>
          <div className="mono" style={{ fontSize:".42rem", color:"rgba(253,250,245,.2)", letterSpacing:".12em", textTransform:"uppercase" }}>
            Drag to rotate · Click nodes to explore · Sphere grows with every conversation
          </div>
        </div>

        {/* Category legend — bottom right if panel hidden */}
        {!showPanel && (
          <div style={{
            position:"absolute", bottom:24, right:32, zIndex:10,
            display:"flex", flexDirection:"column", gap:4,
          }}>
            {Object.entries(CAT_COLORS).slice(0,5).map(([cat, col]) => (
              <div key={cat} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:col, flexShrink:0 }} />
                <span className="mono" style={{ fontSize:".4rem", color:"rgba(253,250,245,.4)", letterSpacing:".08em", textTransform:"uppercase" }}>
                  {cat}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

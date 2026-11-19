"use client"
import { useState } from "react"

// ═══════════════════════════════════════════════════════════════
// STUDEX SUPER AGENTS — Auth Page
// Login + Signup + Magic Link + Google OAuth
// Connects to Supabase Auth
// ═══════════════════════════════════════════════════════════════

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

@keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes pip     { 0%,100%{opacity:1} 50%{opacity:.1} }
@keyframes spin    { to{transform:rotate(360deg)} }

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px}
body{
  font-family:'Cormorant Garamond',serif;
  background:#080604;
  color:#FDFAF5;
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
}
.cinzel{font-family:'Cinzel',serif}
.mono{font-family:'JetBrains Mono',monospace}

input{
  width:100%;
  padding:12px 16px;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(201,169,98,.2);
  color:#FDFAF5;
  font-family:'Cormorant Garamond',serif;
  font-size:1rem;
  outline:none;
  transition:border-color .2s;
  border-radius:0;
}
input:focus{border-color:#C9A962}
input::placeholder{color:rgba(253,250,245,.3)}

.grain{
  position:fixed;inset:0;z-index:9999;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.04;mix-blend-mode:multiply;
}
`

// Supabase client — initialise with env vars
const getSupabase = () => {
  if (typeof window === "undefined") return null
  const { createClient } = window.supabase || {}
  if (!createClient) return null
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )
}

function Spinner() {
  return (
    <div style={{
      width:16, height:16, border:"2px solid rgba(201,169,98,.3)",
      borderTop:"2px solid #C9A962", borderRadius:"50%",
      animation:"spin .8s linear infinite", display:"inline-block",
    }} />
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink:0 }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState("login")       // login | signup | magic | reset
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)    // { type: ok|err, text }
  const [form, setForm] = useState({
    email:"", password:"", firstName:"", lastName:"", company:""
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }))

  const handleGoogle = async () => {
    const sb = getSupabase()
    if (!sb) { setMessage({ type:"err", text:"Auth not configured" }); return }
    setLoading(true)
    const { error } = await sb.auth.signInWithOAuth({
      provider:"google",
      options:{
        redirectTo: `${window.location.origin}/command`,
        queryParams:{ access_type:"offline", prompt:"consent" }
      }
    })
    if (error) setMessage({ type:"err", text:error.message })
    setLoading(false)
  }

  const handleMagicLink = async () => {
    if (!form.email) { setMessage({ type:"err", text:"Enter your email first" }); return }
    const sb = getSupabase()
    if (!sb) { setMessage({ type:"err", text:"Auth not configured" }); return }
    setLoading(true)
    const { error } = await sb.auth.signInWithOtp({
      email: form.email,
      options:{ emailRedirectTo:`${window.location.origin}/command` }
    })
    if (error) setMessage({ type:"err", text:error.message })
    else setMessage({ type:"ok", text:"Magic link sent — check your inbox" })
    setLoading(false)
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setMessage({ type:"err", text:"Email and password required" }); return
    }
    const sb = getSupabase()
    if (!sb) { setMessage({ type:"err", text:"Auth not configured" }); return }
    setLoading(true)
    const { error } = await sb.auth.signInWithPassword({
      email:form.email, password:form.password
    })
    if (error) setMessage({ type:"err", text:error.message })
    else window.location.href = "/command"
    setLoading(false)
  }

  const handleSignup = async () => {
    if (!form.email || !form.password || !form.firstName) {
      setMessage({ type:"err", text:"Name, email and password required" }); return
    }
    if (form.password.length < 8) {
      setMessage({ type:"err", text:"Password must be at least 8 characters" }); return
    }
    const sb = getSupabase()
    if (!sb) { setMessage({ type:"err", text:"Auth not configured" }); return }
    setLoading(true)
    const { error } = await sb.auth.signUp({
      email:form.email, password:form.password,
      options:{
        data:{ first_name:form.firstName, last_name:form.lastName, company:form.company },
        emailRedirectTo:`${window.location.origin}/command`
      }
    })
    if (error) setMessage({ type:"err", text:error.message })
    else setMessage({ type:"ok", text:"Account created — check your email to verify" })
    setLoading(false)
  }

  const handleReset = async () => {
    if (!form.email) { setMessage({ type:"err", text:"Enter your email first" }); return }
    const sb = getSupabase()
    if (!sb) { setMessage({ type:"err", text:"Auth not configured" }); return }
    setLoading(true)
    const { error } = await sb.auth.resetPasswordForEmail(form.email, {
      redirectTo:`${window.location.origin}/auth/update-password`
    })
    if (error) setMessage({ type:"err", text:error.message })
    else setMessage({ type:"ok", text:"Password reset email sent" })
    setLoading(false)
  }

  const btnStyle = {
    width:"100%", padding:"13px",
    background:"#C9A962", border:"none",
    color:"#0D0D0B", fontFamily:"'Cinzel',serif",
    fontSize:".62rem", fontWeight:700,
    letterSpacing:".2em", textTransform:"uppercase",
    cursor:"pointer", display:"flex",
    alignItems:"center", justifyContent:"center", gap:8,
    transition:"opacity .2s",
  }

  const ghostBtn = {
    ...btnStyle,
    background:"transparent",
    border:"1px solid rgba(201,169,98,.3)",
    color:"rgba(253,250,245,.7)",
  }

  return (
    <>
      <style>{css}</style>
      <div className="grain" />

      <div style={{
        minHeight:"100vh", display:"flex", alignItems:"center",
        justifyContent:"center", padding:"24px",
        background:"radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,169,98,.06), #080604)",
      }}>
        <div style={{
          width:"100%", maxWidth:440,
          animation:"fadeUp .5s ease both",
        }}>

          {/* Logo */}
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{
              width:56, height:56, borderRadius:"50%",
              background:"radial-gradient(circle, rgba(201,169,98,.2), rgba(0,0,0,.8))",
              border:"1px solid rgba(201,169,98,.3)",
              display:"inline-flex", alignItems:"center",
              justifyContent:"center", fontSize:"1.6rem",
              marginBottom:16,
            }}>
              ⚡
            </div>
            <div className="cinzel" style={{
              fontSize:"1.1rem", fontWeight:700,
              color:"#FDFAF5", letterSpacing:".16em",
              textTransform:"uppercase", marginBottom:4,
            }}>
              Studex Super Agents
            </div>
            <div className="mono" style={{
              fontSize:".48rem", color:"rgba(201,169,98,.6)",
              letterSpacing:".18em", textTransform:"uppercase",
            }}>
              {mode === "login"  && "Commander Access"}
              {mode === "signup" && "Commission Account"}
              {mode === "magic"  && "Magic Link Access"}
              {mode === "reset"  && "Password Reset"}
            </div>
          </div>

          {/* Card */}
          <div style={{
            background:"rgba(255,255,255,.04)",
            border:"1px solid rgba(201,169,98,.15)",
            borderTop:"2px solid rgba(201,169,98,.6)",
            padding:"32px 28px",
          }}>

            {/* Message */}
            {message && (
              <div style={{
                padding:"10px 14px", marginBottom:20,
                background: message.type==="ok"
                  ? "rgba(30,80,56,.3)"
                  : "rgba(212,74,74,.2)",
                border:`1px solid ${message.type==="ok" ? "rgba(61,200,122,.3)" : "rgba(212,74,74,.3)"}`,
                fontFamily:"'JetBrains Mono',monospace",
                fontSize:".52rem", letterSpacing:".08em",
                color: message.type==="ok" ? "#3DC87A" : "#D44A4A",
              }}>
                {message.type==="ok" ? "✓ " : "✗ "}{message.text}
              </div>
            )}

            {/* Google OAuth */}
            {(mode === "login" || mode === "signup") && (
              <>
                <button onClick={handleGoogle} disabled={loading} style={{
                  ...ghostBtn,
                  marginBottom:16,
                  color:"rgba(253,250,245,.85)",
                }}>
                  {loading ? <Spinner /> : <GoogleIcon />}
                  {mode === "signup" ? "Sign up with Google" : "Continue with Google"}
                </button>

                <div style={{
                  display:"flex", alignItems:"center", gap:12,
                  marginBottom:16,
                }}>
                  <div style={{ flex:1, height:1, background:"rgba(201,169,98,.15)" }} />
                  <span className="mono" style={{ fontSize:".44rem", color:"rgba(253,250,245,.3)", letterSpacing:".12em", textTransform:"uppercase" }}>
                    or
                  </span>
                  <div style={{ flex:1, height:1, background:"rgba(201,169,98,.15)" }} />
                </div>
              </>
            )}

            {/* Signup fields */}
            {mode === "signup" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                <input
                  placeholder="First name *"
                  value={form.firstName}
                  onChange={e => set("firstName", e.target.value)}
                />
                <input
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={e => set("lastName", e.target.value)}
                />
              </div>
            )}

            {/* Company field for signup */}
            {mode === "signup" && (
              <input
                placeholder="Business name"
                value={form.company}
                onChange={e => set("company", e.target.value)}
                style={{ marginBottom:12 }}
              />
            )}

            {/* Email */}
            <input
              type="email"
              placeholder="Email address *"
              value={form.email}
              onChange={e => set("email", e.target.value)}
              onKeyDown={e => {
                if (e.key==="Enter") {
                  if (mode==="login") handleLogin()
                  if (mode==="signup") handleSignup()
                  if (mode==="magic") handleMagicLink()
                  if (mode==="reset") handleReset()
                }
              }}
              style={{ marginBottom: (mode==="magic"||mode==="reset") ? 0 : 8 }}
            />

            {/* Password */}
            {(mode === "login" || mode === "signup") && (
              <input
                type="password"
                placeholder="Password *"
                value={form.password}
                onChange={e => set("password", e.target.value)}
                onKeyDown={e => {
                  if (e.key==="Enter") {
                    if (mode==="login") handleLogin()
                    if (mode==="signup") handleSignup()
                  }
                }}
                style={{ marginBottom:0 }}
              />
            )}

            {/* Submit */}
            <button
              onClick={
                mode==="login"  ? handleLogin   :
                mode==="signup" ? handleSignup  :
                mode==="magic"  ? handleMagicLink :
                handleReset
              }
              disabled={loading}
              style={{ ...btnStyle, marginTop:16 }}
            >
              {loading ? <Spinner /> : null}
              {mode === "login"  && "Access Command Centre"}
              {mode === "signup" && "Commission Account"}
              {mode === "magic"  && "Send Magic Link"}
              {mode === "reset"  && "Send Reset Email"}
            </button>

            {/* Mode switchers */}
            <div style={{
              marginTop:20, display:"flex", flexDirection:"column",
              gap:8, alignItems:"center",
            }}>
              {mode === "login" && (
                <>
                  <button onClick={() => { setMode("magic"); setMessage(null) }}
                    style={{ background:"none", border:"none", cursor:"pointer",
                      fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
                      fontSize:".9rem", color:"rgba(201,169,98,.7)" }}>
                    Send me a magic link instead
                  </button>
                  <button onClick={() => { setMode("reset"); setMessage(null) }}
                    style={{ background:"none", border:"none", cursor:"pointer",
                      fontFamily:"'JetBrains Mono',monospace",
                      fontSize:".44rem", color:"rgba(253,250,245,.3)",
                      letterSpacing:".1em", textTransform:"uppercase" }}>
                    Forgot password
                  </button>
                  <div style={{ height:1, width:"100%", background:"rgba(201,169,98,.1)" }} />
                  <button onClick={() => { setMode("signup"); setMessage(null) }}
                    style={{ background:"none", border:"none", cursor:"pointer",
                      fontFamily:"'JetBrains Mono',monospace",
                      fontSize:".48rem", color:"rgba(253,250,245,.4)",
                      letterSpacing:".1em", textTransform:"uppercase" }}>
                    No account? Commission one →
                  </button>
                </>
              )}
              {(mode === "signup" || mode === "magic" || mode === "reset") && (
                <button onClick={() => { setMode("login"); setMessage(null) }}
                  style={{ background:"none", border:"none", cursor:"pointer",
                    fontFamily:"'JetBrains Mono',monospace",
                    fontSize:".48rem", color:"rgba(253,250,245,.4)",
                    letterSpacing:".1em", textTransform:"uppercase" }}>
                  ← Back to login
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop:24, textAlign:"center",
            fontFamily:"'JetBrains Mono',monospace",
            fontSize:".44rem", color:"rgba(253,250,245,.2)",
            letterSpacing:".08em",
          }}>
            POPIA compliant · Your data stays in South Africa · stud.exchange
          </div>
        </div>
      </div>
    </>
  )
}

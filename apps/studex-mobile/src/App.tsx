import { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';
import { useChatStore, useFleetStore, useDealsStore, useAppStore } from './store';
import { sendToHermes, getFleetStatus, getDeals, sendDealEmail, resumeVM } from './api';
import type { HermesMessage } from './api';

// ── Icons (inline SVGs to avoid lucide dependency) ──────────────
const Icons = {
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  MessageCircle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Server: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  DollarSign: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  AlertTriangle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Zap: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Bot: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Globe: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Package: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  RefreshCw: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Play: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  CheckCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Mail: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Phone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  Cpu: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  HardDrive: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

// ── Header Component ───────────────────────────────────────────
function Header() {
  const { view } = useAppStore();
  const titles: Record<string, string> = {
    home: 'STUDEX OS',
    chat: 'HERMES',
    fleet: 'FLEET',
    'fleet-detail': 'VM DETAIL',
    deals: 'DEALS PIPELINE',
    agents: 'AGENTS',
    settings: 'SETTINGS',
  };
  return (
    <header className="app-header">
      <div className="header-logo">
        <div className="header-logo-mark">S</div>
        <div>
          <div className="header-title">{titles[view] || 'STUDEX OS'}</div>
          <div className="header-subtitle">CEO Dashboard</div>
        </div>
      </div>
      <div className="header-status">
        <div className="status-dot" />
        <span style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 600 }}>ONLINE</span>
      </div>
    </header>
  );
}

// ── Bottom Nav ─────────────────────────────────────────────────
function BottomNav() {
  const { view, navigate } = useAppStore();
  const items = [
    { id: 'home', icon: <Icons.Home />, label: 'Home' },
    { id: 'chat', icon: <Icons.MessageCircle />, label: 'Chat' },
    { id: 'fleet', icon: <Icons.Server />, label: 'Fleet' },
    { id: 'deals', icon: <Icons.DollarSign />, label: 'Deals' },
    { id: 'agents', icon: <Icons.Users />, label: 'Agents' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${view === item.id ? 'active' : ''}`}
          onClick={() => navigate(item.id as any)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ── Home View ──────────────────────────────────────────────────
function HomeView() {
  const { navigate } = useAppStore();
  const { vms } = useFleetStore();
  const onlineCount = vms.filter(v => v.status === 'online').length;
  const frozenCount = vms.filter(v => v.status === 'frozen').length;
  const errorCount = vms.filter(v => v.status === 'error').length;

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>
          Good morning, <span className="gold">Emperor.</span>
        </h1>
        <p style={{ fontSize: 13 }}>
          {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
          &nbsp;·&nbsp;
          <span className="gold" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>09:41 SAST</span>
        </p>
      </div>

      {/* Fleet Summary */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{onlineCount}</div>
          <div className="stat-label">Online</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(249,115,22,0.3)' }}>
          <div className="stat-value" style={{ color: 'var(--orange)' }}>{frozenCount}</div>
          <div className="stat-label">Frozen</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{errorCount}</div>
          <div className="stat-label">Error</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-header">
        <span className="section-title">Quick Actions</span>
      </div>
      <div className="quick-actions">
        <button className="quick-action" onClick={() => navigate('chat')}>
          <div className="quick-action-icon" style={{ background: 'rgba(212,175,55,0.15)' }}>
            <span style={{ fontSize: 20 }}>⚡</span>
          </div>
          <span className="quick-action-label">Chat Hermes</span>
        </button>
        <button className="quick-action" onClick={() => navigate('deals')}>
          <div className="quick-action-icon" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <span style={{ fontSize: 20 }}>💰</span>
          </div>
          <span className="quick-action-label">18 Deals</span>
        </button>
        <button className="quick-action" onClick={() => navigate('fleet')}>
          <div className="quick-action-icon" style={{ background: 'rgba(100,100,255,0.1)' }}>
            <span style={{ fontSize: 20 }}>🖥️</span>
          </div>
          <span className="quick-action-label">Fleet</span>
        </button>
        <button className="quick-action" onClick={() => navigate('agents')}>
          <div className="quick-action-icon" style={{ background: 'rgba(180,0,255,0.1)' }}>
            <span style={{ fontSize: 20 }}>🤖</span>
          </div>
          <span className="quick-action-label">Agents</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="section-header">
        <span className="section-title">Fleet Status</span>
        <span className="section-action" onClick={() => navigate('fleet')}>View All →</span>
      </div>
      {vms.slice(0, 4).map(vm => (
        <div key={vm.id} className="card" onClick={() => navigate('fleet', vm.id)} style={{ cursor: 'pointer' }}>
          <div className="card-header">
            <span className="card-title">{vm.name}</span>
            <span className={`badge ${vm.status === 'online' ? 'green' : vm.status === 'frozen' ? 'orange' : 'red'}`}>
              {vm.status.toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {vm.services?.map(s => (
              <span key={s} className="deal-tag">{s}</span>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: 'var(--gray-500)', fontFamily: 'var(--font-mono)' }}>
            {vm.ip}:{vm.apiPort} · {vm.ram} RAM · {vm.lastSeen}
          </div>
        </div>
      ))}

      {/* Alerts */}
      {(frozenCount > 0 || errorCount > 0) && (
        <div className="card" style={{ borderColor: 'rgba(249,115,22,0.4)', background: 'rgba(249,115,22,0.05)' }}>
          <div className="card-header">
            <span className="card-title">
              <Icons.AlertTriangle /> Fleet Alert
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--gray-300)' }}>
            {frozenCount} VMs frozen, {errorCount} in error state. Resume needed to restore operations.
          </p>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }}
            onClick={() => navigate('fleet')}>
            Resume All VMs
          </button>
        </div>
      )}
    </div>
  );
}

// ── Chat View ───────────────────────────────────────────────────
function ChatView() {
  const { messages, isThinking, addMessage, setThinking } = useChatStore();
  const [input, setInput] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isThinking) return;
    const text = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg: HermesMessage = { role: 'user', content: text, timestamp: Date.now() };
    addMessage(userMsg);
    setThinking(true);
    setShowTyping(true);
    scrollBottom();

    try {
      const reply = await sendToHermes(messages.concat(userMsg));
      const hermesMsg: HermesMessage = { role: 'hermes', content: reply, timestamp: Date.now() };
      addMessage(hermesMsg);
    } catch (err: any) {
      addMessage({
        role: 'hermes',
        content: `Error: ${err.message || 'Could not reach Hermes. Make sure the server is running.'}`,
        timestamp: Date.now(),
      });
    } finally {
      setThinking(false);
      setShowTyping(false);
      scrollBottom();
    }
  }, [input, isThinking, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className="chat-sender">{msg.role === 'hermes' ? '⚡ HERMES' : 'YOU'}</div>
            <div className="chat-bubble">{msg.content}</div>
            <div className="chat-time">
              {new Date(msg.timestamp).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {showTyping && (
          <div className="chat-message hermes">
            <div className="chat-sender">⚡ HERMES</div>
            <div className="chat-bubble">
              <div className="chat-thinking">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-area">
        <div className="chat-input-row">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Message Hermes..."
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button className="chat-send-btn" onClick={sendMessage} disabled={!input.trim() || isThinking}>
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Fleet View ──────────────────────────────────────────────────
function FleetView() {
  const { vms, loading } = useFleetStore();
  const [resuming, setResuming] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResume = async (vm: typeof vms[0]) => {
    setResuming(vm.id);
    try {
      await resumeVM(vm.uuid);
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error(err);
    }
    setResuming(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 4 }}>Orgo AI Fleet</h2>
        <p>{vms.length} desktops · {vms.filter(v => v.status === 'online').length} online</p>
      </div>

      {/* Summary */}
      <div className="stats-row">
        <div className="stat-card green-card">
          <div className="stat-value">{vms.filter(v => v.status === 'online').length}</div>
          <div className="stat-label">Online</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(249,115,22,0.3)' }}>
          <div className="stat-value" style={{ color: 'var(--orange)' }}>{vms.filter(v => v.status === 'frozen').length}</div>
          <div className="stat-label">Frozen</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{vms.filter(v => v.status === 'error').length}</div>
          <div className="stat-label">Error</div>
        </div>
      </div>

      {/* VMs */}
      {vms.map(vm => (
        <div key={vm.id} className={`fleet-card ${vm.status}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div className="fleet-name">{vm.name}</div>
            <span className={`status-dot ${vm.status === 'online' ? '' : vm.status === 'frozen' ? 'warning' : 'offline'}`} />
          </div>
          <div className="fleet-status">{vm.status.toUpperCase()}</div>
          <div className="fleet-meta">{vm.ram} · {vm.cpu}C · {vm.os}</div>
          <div style={{ fontSize: 9, color: 'var(--gray-500)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
            {vm.ip}:{vm.apiPort}
          </div>
          {vm.status !== 'online' && (
            <button
              className="btn btn-outline btn-sm btn-full"
              style={{ marginTop: 8 }}
              onClick={() => handleResume(vm)}
              disabled={resuming === vm.id}
            >
              {resuming === vm.id ? (
                <><Icons.RefreshCw style={{ animation: 'spin 1s linear infinite' }} /> Resuming...</>
              ) : (
                <><Icons.Play /> Resume VM</>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Fleet Detail View ───────────────────────────────────────────
function FleetDetailView() {
  const { subView, goBack } = useAppStore();
  const { vms } = useFleetStore();
  const vm = vms.find(v => v.id === subView);

  if (!vm) return <div className="empty-state"><p>VM not found</p></div>;

  return (
    <div>
      <button className="back-btn" onClick={goBack}>
        <Icons.ChevronLeft /> Back to Fleet
      </button>

      <div className="fleet-detail-header">
        <div className="fleet-detail-icon">
          <Icons.Server />
        </div>
        <div>
          <div className="fleet-detail-name">{vm.name}</div>
          <div className="fleet-detail-meta">{vm.uuid}</div>
          <span className={`badge ${vm.status === 'online' ? 'green' : vm.status === 'frozen' ? 'orange' : 'red'}`} style={{ marginTop: 4 }}>
            {vm.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="fleet-metric-row">
        <div className="fleet-metric">
          <div className="fleet-metric-label">RAM</div>
          <div className="fleet-metric-value">{vm.ram}</div>
        </div>
        <div className="fleet-metric">
          <div className="fleet-metric-label">CPU</div>
          <div className="fleet-metric-value">{vm.cpu}C</div>
        </div>
        <div className="fleet-metric">
          <div className="fleet-metric-label">DISK</div>
          <div className="fleet-metric-value">{vm.disk}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>Connection</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-xs" style={{ color: 'var(--gray-500)' }}>IP Address</span>
            <span className="mono gold">{vm.ip}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-xs" style={{ color: 'var(--gray-500)' }}>API Port</span>
            <span className="mono">{vm.apiPort}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-xs" style={{ color: 'var(--gray-500)' }}>Last Seen</span>
            <span className="mono">{vm.lastSeen}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-xs" style={{ color: 'var(--gray-500)' }}>OS</span>
            <span className="mono">{vm.os}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>Services</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {vm.services?.map(s => (
            <span key={s} className="deal-tag gold">{s}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="btn btn-outline" style={{ flex: 1 }}>
          <Icons.Cpu /> Metrics
        </button>
        <button className="btn btn-gold" style={{ flex: 1 }}>
          <Icons.Play /> Resume
        </button>
      </div>
    </div>
  );
}

// ── Deals View ──────────────────────────────────────────────────
function DealsView() {
  const { deals, loading } = useDealsStore();
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Load deals on mount
  useEffect(() => {
    if (deals.length === 0) {
      getDeals().then(d => useDealsStore.getState().setDeals(d)).catch(() => {
        useDealsStore.getState().setError('Could not load deals');
      });
    }
  }, []);

  const hotDeals = deals.filter(d => d.status === 'hot');
  const warmDeals = deals.filter(d => d.status === 'warm');
  const coldDeals = deals.filter(d => d.status === 'cold');

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 4 }}>Deals Pipeline</h2>
        <p>{deals.length} drafts waiting · 0 sent today</p>
      </div>

      {loading ? (
        <div>
          {[1,2,3].map(i => (
            <div key={i} className="card">
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {hotDeals.length > 0 && (
            <>
              <div className="section-header">
                <span className="section-title" style={{ color: 'var(--gold)' }}>🔥 Hot Deals</span>
              </div>
              {hotDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} selected={selectedDeal === deal.id}
                  onSelect={() => setSelectedDeal(selectedDeal === deal.id ? null : deal.id)}
                  replyText={replyText} setReplyText={setReplyText} />
              ))}
            </>
          )}
          {warmDeals.length > 0 && (
            <>
              <div className="section-header">
                <span className="section-title" style={{ color: 'var(--orange)' }}>⚡ Warm</span>
              </div>
              {warmDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} selected={selectedDeal === deal.id}
                  onSelect={() => setSelectedDeal(selectedDeal === deal.id ? null : deal.id)}
                  replyText={replyText} setReplyText={setReplyText} />
              ))}
            </>
          )}
          {coldDeals.length > 0 && (
            <>
              <div className="section-header">
                <span className="section-title">❄️ Follow-up</span>
              </div>
              {coldDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} selected={selectedDeal === deal.id}
                  onSelect={() => setSelectedDeal(selectedDeal === deal.id ? null : deal.id)}
                  replyText={replyText} setReplyText={setReplyText} />
              ))}
            </>
          )}
          {deals.length === 0 && (
            <div className="empty-state">
              <Icons.Mail />
              <p>No deals loaded</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DealCard({ deal, selected, onSelect, replyText, setReplyText }: {
  deal: any;
  selected: boolean;
  onSelect: () => void;
  replyText: string;
  setReplyText: (v: string) => void;
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await sendDealEmail(deal.id, replyText);
      setSent(true);
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  return (
    <div className={`deal-item ${deal.status}`} onClick={onSelect}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="deal-company">{deal.company}</div>
          <div className="deal-contact">{deal.contact} · {deal.email}</div>
        </div>
        <Icons.ChevronRight />
      </div>
      <div className="deal-subject">{deal.subject}</div>
      <div className="deal-tags">
        <span className="deal-tag gold">{deal.inbox}</span>
        <span className="deal-tag">{deal.status}</span>
      </div>

      {selected && (
        <div style={{ marginTop: 12 }} onClick={e => e.stopPropagation()}>
          <textarea
            className="chat-input"
            style={{ minHeight: 100, marginBottom: 8 }}
            placeholder="Write your reply..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
          />
          {sent ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green)', fontSize: 13, fontWeight: 600 }}>
              <Icons.CheckCircle /> Email sent!
            </div>
          ) : (
            <button className="btn btn-gold btn-full" onClick={handleSend} disabled={sending || !replyText.trim()}>
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Agents View ─────────────────────────────────────────────────
function AgentsView() {
  const { navigate } = useAppStore();
  const agents = [
    { id: 'hermes', name: 'Hermes', role: 'AI CTO', emoji: '⚡', color: 'rgba(212,175,55,0.15)', status: 'online', description: 'Executive command layer — speaks to Tumelo, routes to all agents', vm: 'SA Command' },
    { id: 'comms', name: 'CommsAgent', role: 'Chief Comms', emoji: '📧', color: 'rgba(34,197,94,0.1)', status: 'paused', description: 'Email, Discord, Lark — client comms automation', vm: 'SA Command' },
    { id: 'deals', name: 'DealsAgent', role: 'Deals', emoji: '💰', color: 'rgba(0,200,100,0.1)', status: 'paused', description: 'Deal pipeline, proposals, negotiations', vm: 'SA Command' },
    { id: 'markets', name: 'MarketsAgent', role: 'Markets', emoji: '📊', color: 'rgba(100,100,255,0.1)', status: 'paused', description: 'Trade finance, commodity markets, Africa operations', vm: 'Global Markets' },
    { id: 'research', name: 'ResearchAgent', role: 'Research', emoji: '🔬', color: 'rgba(180,0,255,0.1)', status: 'paused', description: 'GitHub trending, competitive intelligence, AI tools', vm: 'SA Command' },
    { id: 'ops', name: 'OpsAgent', role: 'Operations', emoji: '⚙️', color: 'rgba(249,115,22,0.1)', status: 'paused', description: 'Fleet management, VM health, cron jobs, deploys', vm: 'SA Command' },
    { id: 'cash', name: 'CashClaw', role: 'Finance', emoji: '🦞', color: 'rgba(255,200,0,0.1)', status: 'offline', description: 'HYRVE revenue, client billing, financial dashboards', vm: 'SA Command' },
    { id: 'deer', name: 'DeerFlow', role: 'Deep Research', emoji: '🦌', color: 'rgba(0,200,200,0.1)', status: 'offline', description: 'ByteDance LangGraph deep research harness', vm: 'SA Command' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 4 }}>Studex Agents</h2>
        <p>8 agents · {agents.filter(a => a.status === 'online').length} online · {agents.filter(a => a.status === 'paused').length} paused</p>
      </div>

      <div className="agent-grid">
        {agents.map(agent => (
          <div key={agent.id} className={`agent-card ${agent.status === 'online' ? 'active' : ''}`}>
            <div className="agent-avatar" style={{ background: agent.color }}>
              <span>{agent.emoji}</span>
            </div>
            <div className="agent-name">{agent.name}</div>
            <div className="agent-role">{agent.role}</div>
            <div className="agent-status-text">{agent.description}</div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className={`badge ${agent.status === 'online' ? 'green' : agent.status === 'paused' ? 'orange' : 'red'}`}>
                {agent.status.toUpperCase()}
              </span>
              <span className="text-xs" style={{ color: 'var(--gray-500)' }}>{agent.vm}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <span className="section-title">Active Chats</span>
      </div>
      <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('chat')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>⚡</div>
          <div>
            <div className="agent-name">Chat Hermes</div>
            <div className="agent-status-text">AI CTO — Executive command layer</div>
          </div>
          <Icons.ChevronRight style={{ marginLeft: 'auto' }} />
        </div>
      </div>
    </div>
  );
}

// ── Settings View ────────────────────────────────────────────────
function SettingsView() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div>
      <div className="section-header">
        <span className="section-title">Connection</span>
      </div>
      <div className="card">
        <div className="settings-item" style={{ padding: '10px 0' }}>
          <div>
            <div className="settings-label">Hermes Server</div>
            <div className="settings-desc">localhost:3001</div>
          </div>
          <span className="badge green">CONNECTED</span>
        </div>
        <div className="settings-item" style={{ padding: '10px 0' }}>
          <div>
            <div className="settings-label">AgentMail</div>
            <div className="settings-desc">t.ramaphosa@agentmail.to</div>
          </div>
          <span className="badge green">ACTIVE</span>
        </div>
        <div className="settings-item" style={{ padding: '10px 0', borderBottom: 'none' }}>
          <div>
            <div className="settings-label">Orgo Fleet API</div>
            <div className="settings-desc">sk_live_...f40da</div>
          </div>
          <span className="badge orange">VM FROZEN</span>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Preferences</span>
      </div>
      <div className="card">
        <div className="settings-item" onClick={() => setDarkMode(!darkMode)}>
          <div>
            <div className="settings-label">Dark Mode</div>
            <div className="settings-desc">Black & Gold theme</div>
          </div>
          <div className={`toggle ${darkMode ? 'on' : ''}`} />
        </div>
        <div className="settings-item" onClick={() => setNotifications(!notifications)}>
          <div>
            <div className="settings-label">Push Notifications</div>
            <div className="settings-desc">Deal alerts, fleet alerts, Hermes replies</div>
          </div>
          <div className={`toggle ${notifications ? 'on' : ''}`} />
        </div>
        <div className="settings-item" onClick={() => setPushEnabled(!pushEnabled)} style={{ borderBottom: 'none' }}>
          <div>
            <div className="settings-label">Auto-resume VMs</div>
            <div className="settings-desc">Automatically resume frozen VMs on open</div>
          </div>
          <div className={`toggle ${pushEnabled ? 'on' : ''}`} />
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">About</span>
      </div>
      <div className="card">
        <div className="settings-item" style={{ borderBottom: 'none' }}>
          <div>
            <div className="settings-label">Studex OS</div>
            <div className="settings-desc">v1.0.0 · Hermes AI CTO · Black & Gold Edition</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Toast Notifications ───────────────────────────────────────────
function Toasts() {
  const { toasts, removeToast } = useAppStore();
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast" onClick={() => removeToast(toast.id)}>
          {toast.type === 'error' ? <Icons.AlertTriangle /> : <Icons.CheckCircle />}
          {toast.message}
        </div>
      ))}
    </div>
  );
}

// ── App Root ─────────────────────────────────────────────────────
export default function App() {
  const { view } = useAppStore();

  const renderView = () => {
    switch (view) {
      case 'chat': return <ChatView />;
      case 'fleet': return subView() ? <FleetDetailView /> : <FleetView />;
      case 'deals': return <DealsView />;
      case 'agents': return <AgentsView />;
      case 'settings': return <SettingsView />;
      default: return <HomeView />;
    }
  };

  const subView = () => {
    const { subView } = useAppStore.getState();
    return subView;
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="app-content">
        {renderView()}
      </div>
      <BottomNav />
      <Toasts />
    </div>
  );
}

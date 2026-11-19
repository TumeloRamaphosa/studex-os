// ── Studex OS — Global State ─────────────────────────────────
import { create } from 'zustand';
import type { HermesMessage, FleetVM, Deal, Agent } from './api';

// ── Chat Store ─────────────────────────────────────────────────
interface ChatState {
  messages: HermesMessage[];
  isThinking: boolean;
  error: string | null;
  addMessage: (msg: HermesMessage) => void;
  setThinking: (v: boolean) => void;
  setError: (e: string | null) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      role: 'hermes',
      content: `Good morning, Emperor.

I am Hermes — your AI CTO. The fleet is at your command.

9 of 10 VMs are online. D@RK F@CT0Ry has an ERROR_STATE that needs attention. Your AgentMail has 18 deal drafts waiting to be sent.

What are we building today?`,
      timestamp: Date.now(),
    },
  ],
  isThinking: false,
  error: null,
  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),
  setThinking: (v) => set({ isThinking: v }),
  setError: (e) => set({ error: e }),
  clear: () => set({ messages: [], isThinking: false, error: null }),
}));

// ── Fleet Store ─────────────────────────────────────────────────
interface FleetState {
  vms: FleetVM[];
  selectedVM: FleetVM | null;
  loading: boolean;
  error: string | null;
  setVMs: (vms: FleetVM[]) => void;
  selectVM: (vm: FleetVM | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useFleetStore = create<FleetState>((set) => ({
  vms: [
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
  ],
  selectedVM: null,
  loading: false,
  error: null,
  setVMs: (vms) => set({ vms }),
  selectVM: (vm) => set({ selectedVM: vm }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),
}));

// ── Deals Store ────────────────────────────────────────────────
interface DealsState {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  setDeals: (deals: Deal[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useDealsStore = create<DealsState>((set) => ({
  deals: [],
  loading: false,
  error: null,
  setDeals: (deals) => set({ deals }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),
}));

// ── App Store ───────────────────────────────────────────────────
type View = 'home' | 'chat' | 'fleet' | 'fleet-detail' | 'deals' | 'agents' | 'settings';
type AgentView = 'list' | 'chat';

interface AppState {
  view: View;
  agentView: AgentView;
  subView: string | null;
  toasts: { id: string; message: string; type: string }[];
  addToast: (message: string, type?: string) => void;
  removeToast: (id: string) => void;
  navigate: (view: View, subView?: string) => void;
  goBack: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  view: 'home',
  agentView: 'list',
  subView: null,
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  navigate: (view, subView = null) => set({ view, subView }),
  goBack: () => set({ view: 'home', subView: null }),
}));

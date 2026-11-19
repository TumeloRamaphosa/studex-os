"use client"
import CommandCenter from './command-center.jsx'
import AgentForge from './agent-forge.jsx'
import AuthPage from './auth-page.jsx'
import ManagementDashboard from './management-dashboard.jsx'
import ObsidianBrain from './obsidian-brain.jsx'
import SouldocPage from './souldoc-page.jsx'
import VM5Portal from './vm5-portal.jsx'

export default function Home() {
  return <CommandCenter />
}

export { AgentForge, AuthPage, ManagementDashboard, ObsidianBrain, SouldocPage, VM5Portal }

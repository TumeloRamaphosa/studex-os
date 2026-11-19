# StudeX OS — Coordination Culture

## Mission
Build and operate the most powerful personal AI agent fleet in Africa.
StudeX OS runs Tumelo Ramaphosa's empire: agrifood, trade finance, 7 subsidiaries.

## Coordination Norms

### Task Dispatch
1. LangChain connector routes intent → OpenRig MCP tools
2. `rig_up studex-dev` bootstraps the rig
3. `rig_send coding.owner@studex-dev "<task>"` dispatches to dev-owner
4. `rig_chatroom_send studex-dev "<message>"` broadcasts to all agents

### Quality Flow
1. **dev-owner** implements → delegates creative to **dev-naledi**
2. **dev-kev** reviews → quality gate (Codex, GPT-6 Astra)
3. **orch.lead** approves → snapshot → escalate if blocked

### Escalation Rules
- Disk space <5GB on any Orgo VM → escalate to orch.lead immediately
- API key missing → log error, wait for credentials, do not proceed
- Herdr fleet node down → mark unavailable, continue with active nodes
- Discord bot disconnected → notify orch.lead

### Communication
- Use chatroom for team-wide context
- Use `rig_capture` to observe peer outputs before acting
- Do not interrupt another agent mid-task (no `force: true` unless critical)

### Herdr Integration
- Herdr socket: `~/.config/herdr/herdr.sock` (unix domain socket)
- OpenRig drives Herdr at arm's length via JSON-RPC over the socket
- Herdr manages the non-Claude/Codex agent fleet (Naledi, EDDIE, Charlie, etc.)
- LangChain connector (`/workspace/.herdr/agents/langchain_connector.py`) is the bridge

### Known Constraints
- All 10 Orgo VMs have SSH disabled (VNC only)
- Super Agents Command (69.67.149.85) and Global Markets (185.209.179.145) at 88% disk
- D@RK F@CT0Ry VM (160.202.128.157) in ERROR state
- Qwen API key and Grok API key not yet provided
- tmux must be installed before OpenRig can manage Claude Code sessions

# StudeX OS Agent Roster

## OpenRig Rig: studex-dev

### Pods and Members

| Pod | Member | Runtime | Model | Role |
|-----|--------|---------|-------|------|
| orch | lead | claude-code | claude-sonnet-4 | Orchestration lead |
| coding | owner | claude-code | claude-sonnet-4 | Primary developer |
| coding | naledi | claude-code | claude-sonnet-4 | Write/creative |
| gate | kev | codex | gpt-6-astra | Quality gate |
| infra | herdr | terminal | — | Herdr fleet terminal |
| infra | langchain | terminal | — | LangChain connector terminal |

### Edge Topology
- `orch.lead → coding.owner` (delegates_to)
- `orch.lead → coding.naledi` (delegates_to)
- `coding.owner → gate.kev` (delegates_to)
- `coding.owner → coding.naledi` (delegates_to)
- `gate.kev ↔ coding.owner` (can_observe)
- `gate.kev → orch.lead` (escalates_to)
- `coding.owner → orch.lead` (escalates_to)

### Herdr Integration
OpenRig connects to Herdr via unix domain socket at `~/.config/herdr/herdr.sock`.
Herdr manages non-Claude/Codex agents (LangChain connector agents: Naledi, EDDIE,
Charlie, Kev, Amara, RALF, GIUM, Vera, Zane, Nova, Nova).

### MCP Tools Available to OpenRig Agents
- `rig_up`, `rig_down`, `rig_ps`, `rig_status`
- `rig_send`, `rig_capture`, `rig_chatroom_send`, `rig_chatroom_watch`
- `rig_snapshot_create`, `rig_snapshot_list`, `rig_restore`
- `rig_discover`, `rig_bind`
- `rig_bundle_inspect`, `rig_agent_validate`, `rig_rig_validate`, `rig_rig_nodes`
- `rig_add` (add members to running rigs)

### Deployment
1. Install: `npm install -g @openrig/cli`
2. Setup: `rig setup` (on Razer Blade or MacBook)
3. Bootstrap: `rig up /workspace/openrig/studex-dev/rig.yaml`
4. MCP: `rig mcp serve` (stdio transport, connects to LangChain connector)

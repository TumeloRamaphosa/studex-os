# Work sink

Agents push finished work here until the Agent Lord attaches the Google Drive.

```
work/<lane>/YYYY-MM-DD-<artifact>
```

Lanes:
- orch, ops, global-markets, content, infra, herdr, agentmail, hermes-<profile>

When Drive arrives, this directory becomes the mount or a synced copy. Keep names.
No secrets. No credentials. No client private records.

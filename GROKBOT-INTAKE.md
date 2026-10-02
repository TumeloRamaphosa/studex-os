# Grokbot + Buzz + computer — paste this back

Fill every line. Put secrets in `~/.studex-os/secrets.env` if you do not want them in chat.

```
DISCORD_APPLICATION_ID=
DISCORD_PUBLIC_KEY=
DISCORD_BOT_TOKEN=
DISCORD_GUILD_ID=
DISCORD_CHANNEL_ID=
SLACK_WORKSPACE=          # etherdoge already in OpenClaw — say KEEP or NEW
SLACK_BOT_TOKEN=          # only if NEW
SLACK_APP_TOKEN=          # only if NEW
SLACK_CHANNEL_IDS=
XAI_API_KEY=              # for Grokbot replies
BUZZ_COMMUNITY=studex-agents.communities.buzz.xyz
BUZZ_MEMBERSHIP=          # yes if you added the 8 npubs in Buzz Desktop
ORGO_COMPUTER=Global Markets
ORGO_API_KEY=
ORGO_BASE_URL=
HERMES_VM=keep            # keep hermes-vm SSH as-is unless you say otherwise
```

Discord bot invite URL (after Application ID exists):
https://discord.com/oauth2/authorize?client_id=APPLICATION_ID&permissions=2147485696&scope=bot%20applications.commands

Required Discord perms: Send Messages, Read History, Use Slash Commands, Embed Links.
Required Slack scopes: chat:write, app_mentions:read, channels:history, im:history, socket mode.

Do not paste Buzz nsec/privkey. They are already on disk.

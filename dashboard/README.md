# StudEx Nexus Command Deck

Static dashboard that reads `seats.json` (the OS KERNEL registry) and renders the 16-seat fleet.

## Deploy

### Vercel
```bash
cd ~/studex-os/nexus/dashboard
vercel deploy --prod --yes
```

### Cloudflare (via existing tunnel)
Add to `~/.cloudflared/hermes-dashboard.yml` ingress:
```yaml
  - hostname: nexus.studex-group.com
    service: http://localhost:8787
```
Then serve this dir: `python3 -m http.server 8787 --directory ~/studex-os/nexus/dashboard`

## Update the data
Edit `~/studex-os/nexus/seats.json` and re-copy to `dashboard/seats.json`, or point the fetch at the live registry.

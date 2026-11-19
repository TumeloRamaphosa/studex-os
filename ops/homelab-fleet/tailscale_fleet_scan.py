#!/usr/bin/env python3
import subprocess, json, sys, socket

def get_tailscale_status():
    try:
        result = subprocess.run(
            ["tailscale", "status", "--json"],
            capture_output=True, text=True, timeout=10
        )
        return json.loads(result.stdout)
    except Exception as e:
        return {"error": str(e)}

def check_port(ip, port, timeout=2):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((ip, port))
        sock.close()
        return result == 0
    except:
        return False

def scan_fleet():
    print("=" * 60)
    print("  STUDEX FLEET -- TAILSCALE SCAN")
    print("=" * 60)

    status = get_tailscale_status()
    if "error" in status:
        print(f"Tailscale error: {status['error']}")
        return

    peers = status.get("Peer", {})
    print(f"\nTotal peers: {len(peers)}\n")

    services = {"Ollama": 11434, "HHD API": 5335, "Herdr": 2244, "Gitea": 3000}

    for peer_id, peer in peers.items():
        name = peer.get("HostName", peer.get("DNSName", "unknown"))
        ip = peer.get("TailscaleIPs", ["?"])[0]
        running = []
        for svc, port in services.items():
            if check_port(ip, port):
                running.append(f"{svc}:{port}")
        status_str = ", ".join(running) if running else "no services detected"
        print(f"{name:<20} {ip:<18} {status_str}")

    print()

if __name__ == "__main__":
    scan_fleet()

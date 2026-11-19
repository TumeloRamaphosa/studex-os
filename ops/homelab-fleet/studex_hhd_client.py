#!/usr/bin/env python3
"""
studex_hhd_client.py
Connect to HHD REST API on Steam Deck / MSI Claw / Lenovo from anywhere.
Usage: python3 studex_hhd_client.py <tailscale_ip> [token]
Default token: reads from ~/.config/hhd/token on the target machine via SSH
"""

import requests, sys, json, argparse
from typing import Optional

DEFAULT_PORT = 5335

class HHDClient:
    def __init__(self, ip: str, port: int = DEFAULT_PORT, token: Optional[str] = None):
        self.base = f"http://{ip}:{port}/api/v1"
        self.token = token
        self.session = requests.Session()
        if token:
            self.session.headers.update({"Authorization": f"Bearer {token}"})

    def _get(self, path: str) -> dict:
        r = self.session.get(f"{self.base}/{path}", timeout=10)
        r.raise_for_status()
        return r.json()

    def _post(self, path: str, data: dict) -> dict:
        r = self.session.post(f"{self.base}/{path}", json=data, timeout=15)
        r.raise_for_status()
        return r.json()

    def get_state(self) -> dict:
        return self._get("state")

    def get_settings(self) -> dict:
        return self._get("settings")

    def get_profiles(self) -> list:
        return self._get("profile/list")

    def apply_profile(self, name: str) -> dict:
        return self._get(f"profile/apply?profile={name}")

    def version(self) -> int:
        return self._get("version").get("version", 1)

    def full_status(self) -> dict:
        state = self.get_state()
        profiles = self.get_profiles()
        return {
            "ip": self.base.replace("/api/v1", ""),
            "api_version": self.version(),
            "profiles": profiles,
            "state": state,
        }


def scan_fleet():
    devices = [
        ("Steam Deck", "10.0.0.1"),
        ("MSI Claw 8", "10.0.0.2"),
        ("Razer Edge", "10.0.0.3"),
        ("Lenovo", "10.0.0.4"),
    ]

    print("STUDEX HHD FLEET SCAN")
    print("=" * 50)
    for name, ip in devices:
        try:
            client = HHDClient(ip)
            status = client.full_status()
            state = status["state"]
            print(f"\n[{name}] {ip} -- ONLINE")
            print(f"  Profiles: {status['profiles']}")
            print(f"  State keys: {list(state.keys())}")
        except requests.exceptions.RequestException as e:
            print(f"\n[{name}] {ip} -- OFFLINE ({e})")
    print()


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "scan":
        scan_fleet()
    elif len(sys.argv) > 1:
        ip = sys.argv[1]
        token = sys.argv[2] if len(sys.argv) > 2 else None
        client = HHDClient(ip, token=token)
        print(json.dumps(client.full_status(), indent=2))
    else:
        print("Usage:")
        print("  python3 studex_hhd_client.py <ip> [token]")
        print("  python3 studex_hhd_client.py scan  # Scan all known devices")

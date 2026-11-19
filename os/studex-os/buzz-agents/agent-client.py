#!/usr/bin/env python3
"""
Studex AI Agent Network — Buzz Relay Client
Connects all 7 agents to wss://studex-agents.communities.buzz.xyz
Relays messages between agents and publishes mission updates.

Usage: python3 agent-client.py [agent_name|all]
"""
import asyncio, json, websockets, hashlib, time, secp256k1, os, sys
import nostr.event

KEYPAIRS_FILE = os.path.join(os.path.dirname(__file__), "../mission-crm/agent-keypairs.json")
RELAY = "wss://studex-agents.communities.buzz.xyz"
BIP340_TAG = b"BIP340\x00" * 2

def load_keypairs():
    with open(KEYPAIRS_FILE) as f:
        return json.load(f)

def sign_event(event, sk_bytes):
    ser = nostr.event.Event.serialize(
        event.public_key, event.created_at, event.kind, event.tags, event.content
    )
    id_bytes = hashlib.sha256(ser).digest()
    sk = secp256k1.PrivateKey(bytes(sk_bytes))
    sig_bytes = sk.schnorr_sign(id_bytes, BIP340_TAG)
    event.signature = sig_bytes.hex()
    return {
        "id": event.id, "pubkey": event.public_key,
        "created_at": event.created_at, "kind": event.kind,
        "tags": event.tags, "content": event.content, "sig": event.signature,
    }

class BuzzAgent:
    def __init__(self, name, kp):
        self.name = name
        self.kp = kp
        self.ws = None
        self.since = 0

    async def connect(self):
        self.ws = await websockets.connect(RELAY, ping_interval=20)
        raw = await asyncio.wait_for(self.ws.recv(), timeout=10)
        msg = json.loads(raw)
        if msg[0] != "AUTH":
            raise RuntimeError("No AUTH challenge")
        challenge = msg[1]
        sk_bytes = bytes.fromhex(self.kp["hex_sk"])
        pk_hex = self.kp["hex_pk"]

        # Auth
        auth = nostr.event.Event(kind=22242, content="", public_key=pk_hex,
                                tags=[["challenge", challenge], ["relay", RELAY]])
        await self.ws.send(json.dumps(["AUTH", sign_event(auth, sk_bytes)]))
        resp = await asyncio.wait_for(self.ws.recv(), timeout=8)
        
        # Subscribe to all events (public feed)
        await self.ws.send(json.dumps(["SUB", f"global-{pk_hex[:8]}",
            {"kinds":[1,4,7,9735],"limit":10}]))
        await self.ws.send(json.dumps(["SUB", f"p-{pk_hex[:8]}",
            {"kinds":[1],"authors":[pk_hex]}]))
        
        print(f"  {self.name}: ✓ connected | npub:{self.kp['npub'][:24]}...")

    async def publish(self, content, kind=1, tags=None):
        sk_bytes = bytes.fromhex(self.kp["hex_sk"])
        pk_hex = self.kp["hex_pk"]
        event = nostr.event.Event(kind=kind, content=content,
                                 public_key=pk_hex, tags=(tags or []))
        await self.ws.send(json.dumps(["EVENT", sign_event(event, sk_bytes)]))

    async def relay_events(self):
        """Listen for and forward interesting events."""
        async for raw in self.ws:
            try:
                msg = json.loads(raw)
                if isinstance(msg, list) and msg[0] == "EVENT":
                    evt = msg[2]
                    if evt["pubkey"] != self.kp["hex_pk"]:
                        print(f"  [{self.name}] {evt['pubkey'][:16]}...: {evt.get('content','')[:80]}")
            except:
                pass

    async def run(self):
        await self.connect()
        await self.publish(
            f"🤖 {self.name} ({self.kp['role']}) reconnected to Buzz relay. "
            f"Studex AI Agent Network active. Track: {self.kp['track']}",
            kind=1
        )
        await self.relay_events()

async def main():
    agents = load_keypairs()
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    
    if which == "all":
        tasks = [BuzzAgent(name, kp).run() for name, kp in agents.items()]
    else:
        if which not in agents:
            print(f"Unknown agent: {which}")
            print(f"Available: {', '.join(agents.keys())}")
            return
        tasks = [BuzzAgent(which, agents[which]).run()]
    
    print(f"Starting Buzz agent network: {[t.get_name() for t in tasks]}")
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())

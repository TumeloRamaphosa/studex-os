#!/usr/bin/env python3
import json, os, sys, datetime

BRIDGE_ROOT = os.environ.get("STUDEX_BRIDGE_ROOT", os.path.dirname(os.path.abspath(__file__)))
BRIDGE_DIR  = os.path.join(BRIDGE_ROOT, "bridge")
INBOX       = os.path.join(BRIDGE_DIR, "inbox")

TOOLS = [
    {"name":"studex_list_files","description":"List files/folders","inputSchema":{"type":"object","properties":{"path":{"type":"string"}}}}
   ,{"name":"studex_read_file","description":"Read a file","inputSchema":{"type":"object","required":["path"],"properties":{"path":{"type":"string"}}}}
   ,{"name":"studex_write_file","description":"Write/create a file","inputSchema":{"type":"object","required":["path","content"],"properties":{"path":{"type":"string"},"content":{"type":"string"}}}}
   ,{"name":"studex_search","description":"Search pack for keyword","inputSchema":{"type":"object","required":["query"],"properties":{"query":{"type":"string"},"path":{"type":"string"}}}}
   ,{"name":"studex_get_status","description":"Read bridge/STATUS.md","inputSchema":{"type":"object"}}
   ,{"name":"studex_leave_message","description":"Leave message in bridge inbox","inputSchema":{"type":"object","required":["from_name","message"],"properties":{"from_name":{"type":"string"},"message":{"type":"string"}}}}
   ,{"name":"studex_read_inbox","description":"Read all inbox messages","inputSchema":{"type":"object"}}
]

def safe_path(rel):
    rel = (rel or "").strip().lstrip("/")
    full = os.path.realpath(os.path.join(BRIDGE_ROOT, rel))
    if not full.startswith(BRIDGE_ROOT + os.sep) and full != BRIDGE_ROOT:
        raise ValueError("Path escapes pack: %s" % rel)
    return full

def list_files(args):
    base = safe_path(args.get("path",""))
    out = []
    for root,dirs,files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in (".git","node_modules","__pycache__")]
        rel = os.path.relpath(root, BRIDGE_ROOT)
        for d in dirs: out.append((rel+"/"+d+"/"))
        for f in files: out.append((rel+"/"+f if rel!="." else f))
    return "\n".join(out[:400]) or "(empty)"

def read_file(args):
    with open(safe_path(args["path"]),"r",encoding="utf-8",errors="replace") as fh: return fh.read(100*1024)

def write_file(args):
    full = safe_path(args["path"]); os.makedirs(os.path.dirname(full),exist_ok=True)
    with open(full,"w",encoding="utf-8") as fh: fh.write(args["content"])
    return "Wrote %d bytes to %s" % (len(args["content"]),args["path"])

def search(args):
    query = args["query"].lower(); base = safe_path(args.get("path",""))
    matches = []
    for root,dirs,files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in (".git","node_modules","__pycache__")]
        for f in files:
            if os.path.getsize(os.path.join(root,f))>2*1024*1024: continue
            try:
                with open(os.path.join(root,f),"r",encoding="utf-8",errors="ignore") as fh:
                    for i,line in enumerate(fh,1):
                        if query in line.lower():
                            matches.append("%s:%d: %s"%(os.path.relpath(os.path.join(root,f),BRIDGE_ROOT),i,line.strip()[:160]))
                        if len(matches)>=50: return "\n".join(matches)
            except OSError: pass
    return "\n".join(matches) or "(no matches)"

def get_status(args):
    p = os.path.join(BRIDGE_DIR,"STATUS.md")
    return open(p,"r",encoding="utf-8").read() if os.path.exists(p) else "No STATUS.md found."

def leave_message(args):
    os.makedirs(INBOX,exist_ok=True)
    fname = "%s-%s.md" % (datetime.date.today().isoformat(),"".join(c if c.isalnum() else "_" for c in args["from_name"])[:30])
    path = os.path.join(INBOX,fname)
    stamp = datetime.datetime.now().isoformat(timespec="seconds")
    with open(path,"a",encoding="utf-8") as fh:
        fh.write("\n\n---\n**From:** %s\n**At:** %s\n\n%s\n"%(args["from_name"],stamp,args["message"]))
    return "Message logged to %s. Katjana reads inbox on every wake-up." % fname

def read_inbox(args):
    if not os.path.isdir(INBOX): return "(inbox empty)"
    parts = []
    for f in sorted(os.listdir(INBOX)):
        if not f.endswith(".md"): continue
        with open(os.path.join(INBOX,f),"r",encoding="utf-8",errors="replace") as fh: parts.append("=== %s ===\n%s"%(f,fh.read()))
    return "\n\n".join(parts) or "(inbox empty)"

DISPATCH = {n:f for n,f in [
    ("studex_list_files",list_files),("studex_read_file",read_file),
    ("studex_write_file",write_file),("studex_search",search),
    ("studex_get_status",get_status),("studex_leave_message",leave_message),
    ("studex_read_inbox",read_inbox),
]}

def handle(msg):
    method = msg.get("method",""); mid = msg.get("id")
    if method=="initialize": return {"jsonrpc":"2.0","id":mid,"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"studex-mcp-bridge","version":"1.0.0"}}}
    if method in ("notifications/initialized","notifications/cancelled"): return None
    if method=="ping": return {"jsonrpc":"2.0","id":mid,"result":{}}
    if method=="tools/list": return {"jsonrpc":"2.0","id":mid,"result":{"tools":TOOLS}}
    if method=="tools/call":
        params = msg.get("params",{}); name = params.get("name"); args = params.get("arguments",{}) or {}
        fn = DISPATCH.get(name)
        if not fn: return {"jsonrpc":"2.0","id":mid,"result":{"content":[{"type":"text","text":"Unknown tool: %s"%name}],"isError":True}}
        try: return {"jsonrpc":"2.0","id":mid,"result":{"content":[{"type":"text","text":fn(args)}]}}
        except Exception as exc: return {"jsonrpc":"2.0","id":mid,"result":{"content":[{"type":"text","text":"Error: %s"%exc}],"isError":True}}
    if mid is not None: return {"jsonrpc":"2.0","id":mid,"error":{"code":-32601,"message":"Method not found: %s"%method}}
    return None

def main():
    os.makedirs(INBOX,exist_ok=True)
    for line in sys.stdin:
        line=line.strip()
        if not line: continue
        try: msg=json.loads(line)
        except json.JSONDecodeError: continue
        resp=handle(msg)
        if resp is not None:
            sys.stdout.write(json.dumps(resp)+"\n"); sys.stdout.flush()

if __name__=="__main__": main()

#!/usr/bin/env python3
"""
Master Command Center — Local Datastore (Firestore-compatible surface)

Runs on :5005 and exposes a Firestore-like REST API over SQLite so the
command center, the agent mesh, and any external client can talk to it
without needing a Firebase project.

Surface:
  GET    /v1/{collection}                     -> list documents
  GET    /v1/{collection}/{docId}              -> get document
  POST   /v1/{collection}                     -> create document
  PUT    /v1/{collection}/{docId}              -> set (merge) document
  PATCH  /v1/{collection}/{docId}              -> update (merge) document
  DELETE /v1/{collection}/{docId}              -> delete document
  GET    /v1/{collection}/{docId}/{sub}        -> list subcollection
  POST   /v1/{collection}/{docId}/{sub}        -> create in subcollection
  PUT    /v1/{collection}/{docId}/{sub}/{subId}-> set in subcollection
  GET    /health

Firestore-style document paths (e.g. /tasks/TASK-1/result) work because the
path segments are treated as collection/document pairs.

Auth: optional. If MASTER_STORE_KEY is set, requests must carry
`X-Master-Key: <key>`. If unset, the store is open on localhost only.
"""

from __future__ import annotations

import json
import os
import sqlite3
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote

DB_PATH = os.environ.get("MASTER_STORE_DB", "/workspace/master-command-center/data/store.db")
PORT = int(os.environ.get("MASTER_STORE_PORT", "5005"))
API_KEY = os.environ.get("MASTER_STORE_KEY", "")

_lock = threading.RLock()
_conn: sqlite3.Connection | None = None


def utcnow() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def get_conn() -> sqlite3.Connection:
    global _conn
    with _lock:
        if _conn is None:
            os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
            _conn = sqlite3.connect(DB_PATH, check_same_thread=False)
            _conn.execute("PRAGMA journal_mode=WAL")
            _conn.execute(
                """CREATE TABLE IF NOT EXISTS docs (
                    collection TEXT NOT NULL,
                    doc_id     TEXT NOT NULL,
                    parent     TEXT DEFAULT '',
                    data       TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    PRIMARY KEY (collection, doc_id, parent)
                )"""
            )
            _conn.execute("CREATE INDEX IF NOT EXISTS idx_docs_parent ON docs(collection, parent)")
            _conn.commit()
        return _conn


def now_ms() -> int:
    return int(time.time() * 1000)


def _row_to_doc(row) -> dict:
    data = json.loads(row[0])
    return data


def list_docs(collection: str, parent: str = "") -> list[dict]:
    conn = get_conn()
    cur = conn.execute(
        "SELECT data FROM docs WHERE collection=? AND parent=? ORDER BY created_at",
        (collection, parent),
    )
    return [json.loads(r[0]) for r in cur.fetchall()]


def get_doc(collection: str, doc_id: str, parent: str = "") -> dict | None:
    conn = get_conn()
    cur = conn.execute(
        "SELECT data FROM docs WHERE collection=? AND doc_id=? AND parent=?",
        (collection, doc_id, parent),
    )
    row = cur.fetchone()
    return json.loads(row[0]) if row else None


def set_doc(collection: str, doc_id: str, data: dict, parent: str = "", merge: bool = True) -> dict:
    conn = get_conn()
    with _lock:
        existing = get_doc(collection, doc_id, parent)
        if existing and merge:
            merged = dict(existing)
            merged.update(data)
        else:
            merged = dict(data)
        ts = utcnow()
        merged.setdefault("createdAt", ts)
        merged["updatedAt"] = ts
        conn.execute(
            """INSERT INTO docs (collection, doc_id, parent, data, created_at, updated_at)
               VALUES (?,?,?,?,?,?)
               ON CONFLICT(collection, doc_id, parent)
               DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at""",
            (collection, doc_id, parent, json.dumps(merged), ts, ts),
        )
        conn.commit()
    return merged


def delete_doc(collection: str, doc_id: str, parent: str = "") -> bool:
    conn = get_conn()
    with _lock:
        cur = conn.execute(
            "DELETE FROM docs WHERE collection=? AND doc_id=? AND parent=?",
            (collection, doc_id, parent),
        )
        conn.commit()
        return cur.rowcount > 0


class Handler(BaseHTTPRequestHandler):
    server_version = "MasterStore/1.0"

    def log_message(self, fmt, *args):  # quieter logging
        pass

    def _send(self, code: int, payload):
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _auth_ok(self) -> bool:
        if not API_KEY:
            return True
        return self.headers.get("X-Master-Key", "") == API_KEY

    def _body(self) -> dict:
        length = int(self.headers.get("Content-Length", 0) or 0)
        if not length:
            return {}
        raw = self.rfile.read(length)
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {}

    def _path_parts(self) -> list[str]:
        path = urlparse(self.path).path
        for prefix in ("/v1", "/api/v1"):
            if path.startswith(prefix):
                path = path[len(prefix):]
                break
        else:
            path = path.lstrip("/")
        return [unquote(p) for p in path.split("/") if p]

    # ── routing ────────────────────────────────────────────────────────
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Master-Key")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        self.end_headers()

    def do_GET(self):
        if urlparse(self.path).path in ("/health", "/"):
            self._send(200, {"status": "ok", "service": "master-store", "db": DB_PATH, "time": utcnow()})
            return
        if not self._auth_ok():
            self._send(401, {"error": "unauthorized"})
            return
        parts = self._path_parts()
        if not parts:
            self._send(400, {"error": "missing collection"})
            return
        if len(parts) == 1:
            self._send(200, {"docs": list_docs(parts[0])})
            return
        if len(parts) == 2:
            doc = get_doc(parts[0], parts[1])
            self._send(200 if doc else 404, doc or {"error": "not found", "id": parts[1]})
            return
        # subcollection
        parent = parts[1]
        if len(parts) == 3:
            self._send(200, {"docs": list_docs(parts[2], parent)})
            return
        doc = get_doc(parts[2], parts[3], parent)
        self._send(200 if doc else 404, doc or {"error": "not found", "id": parts[3]})

    def do_POST(self):
        if not self._auth_ok():
            self._send(401, {"error": "unauthorized"})
            return
        parts = self._path_parts()
        body = self._body()
        if len(parts) == 1:
            doc_id = body.get("id") or body.get("__name__") or f"auto-{now_ms()}"
            self._send(200, set_doc(parts[0], doc_id, body, parent=""))
            return
        if len(parts) == 3:
            doc_id = body.get("id") or f"auto-{now_ms()}"
            self._send(200, set_doc(parts[2], doc_id, body, parent=parts[1]))
            return
        self._send(400, {"error": "bad path for POST"})

    def do_PUT(self):
        if not self._auth_ok():
            self._send(401, {"error": "unauthorized"})
            return
        parts = self._path_parts()
        body = self._body()
        if len(parts) == 2:
            self._send(200, set_doc(parts[0], parts[1], body, parent="", merge=False))
            return
        if len(parts) == 4:
            self._send(200, set_doc(parts[2], parts[3], body, parent=parts[1], merge=False))
            return
        self._send(400, {"error": "bad path for PUT"})

    def do_PATCH(self):
        if not self._auth_ok():
            self._send(401, {"error": "unauthorized"})
            return
        parts = self._path_parts()
        body = self._body()
        if len(parts) == 2:
            self._send(200, set_doc(parts[0], parts[1], body, parent="", merge=True))
            return
        if len(parts) == 4:
            self._send(200, set_doc(parts[2], parts[3], body, parent=parts[1], merge=True))
            return
        self._send(400, {"error": "bad path for PATCH"})

    def do_DELETE(self):
        if not self._auth_ok():
            self._send(401, {"error": "unauthorized"})
            return
        parts = self._path_parts()
        ok = False
        if len(parts) == 2:
            ok = delete_doc(parts[0], parts[1])
        elif len(parts) == 4:
            ok = delete_doc(parts[2], parts[3], parent=parts[1])
        self._send(200 if ok else 404, {"deleted": ok})


if __name__ == "__main__":
    get_conn()
    srv = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"[master-store] listening on 0.0.0.0:{PORT} db={DB_PATH}", flush=True)
    srv.serve_forever()

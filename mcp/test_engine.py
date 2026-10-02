#!/usr/bin/env python3
"""Smoke tests for the StudEx LangChain MCP engine. No live network required except optional probes."""
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path

os.environ["STUDEX_OS_ROOT"] = tempfile.mkdtemp(prefix="studex-os-")
os.environ["STUDEX_WORK_ROOT"] = str(Path(os.environ["STUDEX_OS_ROOT"]) / "work")
os.environ.pop("ORGO_API_KEY", None)
os.environ.pop("AGENTMAIL_API_KEY", None)
os.environ.pop("DROIDDESK_URL", None)
os.environ.pop("ORGO_COMPUTER_ID", None)

sys.path.insert(0, str(Path(__file__).resolve().parent))
import langchain_engine as eng  # noqa: E402


class EngineTests(unittest.TestCase):
    def test_health(self):
        h = eng.dispatch("health", {})
        self.assertTrue(h["ok"])
        self.assertEqual(h["service"], "studex-nexus-langchain-engine")
        self.assertEqual(h["orgo_key"], "missing")
        self.assertEqual(h["agentmail_key"], "missing")
        self.assertEqual(h["drive"], "Death Star")

    def test_tools_known(self):
        needed = (
            "seats_list", "seats_heartbeat", "work_push", "models_list",
            "orgo_status", "deerflow_status", "droiddesk_status",
            "openclaw_status", "drive_status", "buzz_status", "fleet_status",
            "businesses_list", "grokbot_status", "hermes_status", "denchclaw_status",
            "agentmail_inboxes",
        )
        for name in needed:
            self.assertIn(name, eng.TOOLS)

    def test_heartbeat_and_seats(self):
        r = eng.dispatch("seats_heartbeat", {"slug": "qa-bot", "seat": "QA", "status": "online", "model": "test"})
        self.assertTrue(r["ok"])
        seats = eng.dispatch("seats_list", {})
        self.assertIn("qa-bot", seats["seats"])
        self.assertEqual(seats["seats"]["qa-bot"]["model"], "test")
        stored = json.loads((eng.SEATS).read_text())
        self.assertEqual(stored["total_seats"], len(stored["seats"]))

    def test_work_push(self):
        r = eng.dispatch("work_push", {"lane": "ops", "filename": "note.md", "content": "hello studex"})
        self.assertTrue(r["ok"])
        path = Path(r["path"])
        self.assertTrue(path.exists())
        self.assertIn("hello studex", path.read_text())
        self.assertEqual(r["drive"], "Death Star")

    def test_unknown_tool(self):
        r = eng.dispatch("not-a-tool", {})
        self.assertFalse(r["ok"])

    def test_deerflow_probe_shape(self):
        r = eng.dispatch("deerflow_status", {})
        self.assertIn("repo", r)
        self.assertEqual(r["repo"], "https://github.com/bytedance/deer-flow")

    def test_droiddesk_probe_shape(self):
        r = eng.dispatch("droiddesk_status", {})
        self.assertIn("repo", r)
        self.assertEqual(r["repo"], "https://github.com/orailnoor/DroidDesk")
        self.assertFalse(r["ok"])

    def test_parse_post_tool_uses_name(self):
        name, args = eng.parse_tool_call("/tool", {"name": "orgo_status", "arguments": {}})
        self.assertEqual(name, "orgo_status")
        self.assertEqual(args, {})

    def test_parse_mcp_method(self):
        name, args = eng.parse_tool_call("/mcp", {"method": "seats_list", "params": {"x": 1}})
        self.assertEqual(name, "seats_list")
        self.assertEqual(args, {"x": 1})

    def test_parse_get_alias(self):
        name, _ = eng.parse_tool_call("/fleet", {})
        self.assertEqual(name, "fleet_status")

    def test_empty_secret_is_missing(self):
        os.environ["ORGO_API_KEY"] = "   "
        self.assertFalse(eng.secret_present("ORGO_API_KEY"))
        os.environ.pop("ORGO_API_KEY", None)
        r = eng.dispatch("orgo_status", {})
        self.assertFalse(r["ok"])
        self.assertIn("ORGO_API_KEY", r["error"])

    def test_drive_status_shape(self):
        r = eng.dispatch("drive_status", {})
        self.assertTrue(r["ok"])
        self.assertEqual(r["name"], "Death Star")
        self.assertEqual(r["folder_id"], "1Ap0rPgpnUli89561ZKgHxY59AIXQ5zgx")

    def test_fleet_status_shape(self):
        r = eng.dispatch("fleet_status", {})
        self.assertTrue(r["ok"])
        self.assertIn("live", r)
        self.assertIn("drive", r["detail"])
        self.assertTrue(r["detail"]["drive"]["ok"])
        self.assertIn("engine", r["live"])

    def test_redact_strips_vnc(self):
        out = eng.redact({"id": "abc", "vnc_password": "nope", "nested": {"api_key": "x"}})
        self.assertEqual(out["id"], "abc")
        self.assertEqual(out["vnc_password"], "[redacted]")
        self.assertEqual(out["nested"]["api_key"], "[redacted]")

    def test_slim_desktop_drops_vnc(self):
        out = eng.slim_desktop({"id": "1", "name": "Global Markets", "status": "running", "cpu": 2, "ram": 16, "vnc_password": "nope", "url": "http://10.0.0.1"})
        self.assertEqual(out["name"], "Global Markets")
        self.assertNotIn("vnc_password", out)
        self.assertNotIn("url", out)

    def test_ingest_skips_empty(self):
        tmp = Path(os.environ["STUDEX_OS_ROOT"]) / "empty.env"
        tmp.write_text("FOO=\nBAR=ok\n")
        os.environ.pop("FOO", None)
        os.environ.pop("BAR", None)
        eng._ingest_env_file(tmp)
        self.assertNotIn("FOO", os.environ)
        self.assertEqual(os.environ.get("BAR"), "ok")
        os.environ.pop("BAR", None)


if __name__ == "__main__":
    unittest.main()

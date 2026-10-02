#!/usr/bin/env python3
"""Smoke tests for the StudEx LangChain MCP engine. No network required except optional probes."""
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

sys.path.insert(0, str(Path(__file__).resolve().parent))
import langchain_engine as eng  # noqa: E402


class EngineTests(unittest.TestCase):
    def test_health(self):
        h = eng.dispatch("health", {})
        self.assertTrue(h["ok"])
        self.assertEqual(h["service"], "studex-nexus-langchain-engine")

    def test_tools_known(self):
        for name in ("seats_list", "seats_heartbeat", "work_push", "models_list", "orgo_status", "deerflow_status", "droiddesk_status"):
            self.assertIn(name, eng.TOOLS)

    def test_heartbeat_and_seats(self):
        r = eng.dispatch("seats_heartbeat", {"slug": "qa-bot", "seat": "QA", "status": "online", "model": "test"})
        self.assertTrue(r["ok"])
        seats = eng.dispatch("seats_list", {})
        self.assertIn("qa-bot", seats["seats"])
        self.assertEqual(seats["seats"]["qa-bot"]["model"], "test")

    def test_work_push(self):
        r = eng.dispatch("work_push", {"lane": "ops", "filename": "note.md", "content": "hello studex"})
        self.assertTrue(r["ok"])
        path = Path(r["path"])
        self.assertTrue(path.exists())
        self.assertIn("hello studex", path.read_text())

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


if __name__ == "__main__":
    unittest.main()

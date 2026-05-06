// ======================================
// IGM — Inference Governance Module
// Anthropic Proxy + IGM Pipeline Proxy
// DeBacco Nexus LLC | USPTO 19/571,156
// ======================================

import express from "express";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const IGM_PIPELINE_URL  = process.env.IGM_PIPELINE_URL;
const IGM_LIVE_KEY      = process.env.IGM_LIVE_KEY;

console.log("[IGM] Starting proxy server...");
console.log("[IGM] ANTHROPIC_API_KEY present:", !!ANTHROPIC_API_KEY);
console.log("[IGM] IGM_PIPELINE_URL present:", !!IGM_PIPELINE_URL);
console.log("[IGM] IGM_LIVE_KEY present:", !!IGM_LIVE_KEY);

// ── Serve static HTML ──────────────────────────────────────
app.use(express.static(__dirname));
// ── Regulator proxy ────────────────────────────────────────
app.post("/proxy/regulator", async (req, res) => {
  try {
    const response = await fetch("http://localhost:5002/v1/receive", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json({logged: false, error: err.message});
  }
});
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(join(__dirname, "igm_dashboard.html"));
});

app.get("/repositories", (req, res) => {
  res.sendFile(join(__dirname, "ai_repositories.html"));
});

app.get("/demo2", (req, res) => {
  res.sendFile(join(__dirname, "igm_demo_v2.html"));
});

app.get("/tracker", (req, res) => {
  res.sendFile(join(__dirname, "mva_igm_tracker.html"));
});

// ── Health check ───────────────────────────────────────────
// ── Log ungoverned inference ───────────────────────────────
app.post("/log/ungoverned", async (req, res) => {
  if (!IGM_PIPELINE_URL) return res.json({ logged: false });
  try {
    const response = await fetch(`${IGM_PIPELINE_URL}/v1/log/ungoverned`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json({ logged: false, error: err.message });
  }
});
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    key_present: !!ANTHROPIC_API_KEY,
    igm_pipeline_connected: !!IGM_PIPELINE_URL,
    timestamp: new Date().toISOString()
  });
});

// ── Anthropic proxy (ungoverned path) ──────────────────────
app.post("/proxy/anthropic", async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("[IGM] Anthropic proxy error:", err.message);
    res.status(500).json({ error: "Proxy error", message: err.message });
  }
});

// ── IGM pipeline proxy (governed path) ─────────────────────
app.post("/proxy/igm", async (req, res) => {
  if (IGM_PIPELINE_URL && IGM_LIVE_KEY) {
    try {
      const prompt   = req.body.messages?.[0]?.content || req.body.prompt || "";
      const langHint = req.body.lang_hint || "en";

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);

      const response = await fetch(`${IGM_PIPELINE_URL}/v1/infer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${IGM_LIVE_KEY}`
        },
        body: JSON.stringify({ text: prompt, lang_hint: langHint }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      const data = await response.json();
      if (data.text) {
        return res.json({
          content: [{ type: "text", text: data.text }],
          usage: {
            output_tokens: data.governance?.token_count || 0,
            input_tokens: 0
          },
          igm_governance: data.governance,
          igm_catalogue_id: data.catalogue_entry_id,
          igm_pipeline_ms: data.pipeline_ms
        });
      }
      throw new Error(data.detail || "IGM pipeline error");
    } catch (err) {
      console.error("[IGM] Pipeline error, falling back to Anthropic:", err.message);
    }
  }

  // Fallback to Anthropic
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Neither IGM pipeline nor ANTHROPIC_API_KEY configured" });
  }
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("[IGM] Fallback Anthropic error:", err.message);
    res.status(500).json({ error: "Proxy error", message: err.message });
  }
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[IGM] Proxy server running on port ${PORT}`);
});

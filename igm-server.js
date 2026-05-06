// ======================================
// IGM — Inference Governance Module
// Anthropic Proxy + IGM Pipeline Proxy
// + MVA-JIV JSON File Storage
// DeBacco Nexus LLC | USPTO 19/571,156
// ======================================

import express from "express";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";

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

// ── MVA-JIV JSON Storage ───────────────────────────────────
const DB_PATH = join(__dirname, "mva_jiv_data.json");

function readDB() {
  if (!existsSync(DB_PATH)) {
    const empty = { interactions: [], intakes: [] };
    writeFileSync(DB_PATH, JSON.stringify(empty));
    return empty;
  }
  try {
    return JSON.parse(readFileSync(DB_PATH, "utf8"));
  } catch(e) {
    return { interactions: [], intakes: [] };
  }
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

console.log("[IGM] MVA-JIV JSON storage initialized");

// ── JIV API: Log interaction ───────────────────────────────
app.post("/api/jiv/log", (req, res) => {
  try {
    const db = readDB();
    const entry = { id: Date.now(), ...req.body };
    db.interactions.unshift(entry);
    writeDB(db);
    res.json({ success: true, id: entry.id });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Get interactions ──────────────────────────────
app.get("/api/jiv/log", (req, res) => {
  try {
    const db = readDB();
    const staff = req.query.staff;
    const interactions = staff
      ? db.interactions.filter(e => e.staff === staff)
      : db.interactions;
    res.json({ success: true, interactions });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Delete interactions ───────────────────────────
app.delete("/api/jiv/log", (req, res) => {
  try {
    const db = readDB();
    const staff = req.query.staff;
    if (staff) {
      db.interactions = db.interactions.filter(e => e.staff !== staff);
    } else {
      db.interactions = [];
    }
    writeDB(db);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Submit intake ─────────────────────────────────
app.post("/api/jiv/intake", (req, res) => {
  try {
    const db = readDB();
    const entry = { id: Date.now(), timestamp: new Date().toISOString(), ...req.body };
    db.intakes.unshift(entry);
    // Also log as interaction
    db.interactions.unshift({
      id: Date.now() + 1,
      timestamp: entry.timestamp,
      staff: entry.staff || 'Unknown',
      title: entry.staffTitle || '',
      type: 'intake',
      court: entry.court || '',
      ungov: 480, gov: 150, saved: 330, pct: 69,
      timeSaved: 15,
      notes: `Intake: ${entry.last || ''}, ${entry.first || ''} · Case: ${entry.caseNum || 'Pending'}`,
      energy: '99.0', water: '165.0', co2: '49.50', cost: '0.00099',
      catalogueId: entry.catalogueId || '',
      veteranName: `${entry.last || ''}, ${entry.first || ''}`
    });
    writeDB(db);
    res.json({ success: true, catalogueId: entry.catalogueId });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Get intakes ───────────────────────────────────
app.get("/api/jiv/intake", (req, res) => {
  try {
    const db = readDB();
    res.json({ success: true, intakes: db.intakes });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Summary ───────────────────────────────────────
app.get("/api/jiv/summary", (req, res) => {
  try {
    const db = readDB();
    const total = db.interactions.length;
    const totalSaved = db.interactions.reduce((s,e) => s + (e.saved||0), 0);
    const totalTime = db.interactions.reduce((s,e) => s + (e.timeSaved||0), 0);
    res.json({ success: true, total, totalSaved, totalTime, intakeCount: db.intakes.length });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Serve static HTML ──────────────────────────────────────
app.use(express.static(__dirname));

// ── Regulator proxy ────────────────────────────────────────
app.post("/proxy/regulator", async (req, res) => {
  try {
    const response = await fetch("http://localhost:5002/v1/receive", {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json({logged: false, error: err.message});
  }
});

app.get("/", (req, res) => { res.sendFile(join(__dirname, "index.html")); });
app.get("/dashboard", (req, res) => { res.sendFile(join(__dirname, "igm_dashboard.html")); });
app.get("/repositories", (req, res) => { res.sendFile(join(__dirname, "ai_repositories.html")); });
app.get("/demo2", (req, res) => { res.sendFile(join(__dirname, "igm_demo_v2.html")); });
app.get("/tracker", (req, res) => { res.sendFile(join(__dirname, "mva_igm_tracker.html")); });
app.get("/jiv", (req, res) => { res.sendFile(join(__dirname, "mva_jiv_log.html")); });
app.get("/intake", (req, res) => { res.sendFile(join(__dirname, "vtc_intake_form.html")); });
app.get("/vetlog", (req, res) => { res.sendFile(join(__dirname, "mva_vet_services_log.html")); });

// ── Health check ───────────────────────────────────────────
app.post("/log/ungoverned", async (req, res) => {
  if (!IGM_PIPELINE_URL) return res.json({ logged: false });
  try {
    const response = await fetch(`${IGM_PIPELINE_URL}/v1/log/ungoverned`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json({ logged: false, error: err.message });
  }
});

app.get("/health", (req, res) => {
  const db = readDB();
  res.json({
    status: "ok",
    key_present: !!ANTHROPIC_API_KEY,
    igm_pipeline_connected: !!IGM_PIPELINE_URL,
    jiv_db: "active",
    jiv_interactions: db.interactions.length,
    timestamp: new Date().toISOString()
  });
});

// ── Anthropic proxy ────────────────────────────────────────
app.post("/proxy/anthropic", async (req, res) => {
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", message: err.message });
  }
});

// ── IGM pipeline proxy ─────────────────────────────────────
app.post("/proxy/igm", async (req, res) => {
  if (IGM_PIPELINE_URL && IGM_LIVE_KEY) {
    try {
      const prompt = req.body.messages?.[0]?.content || req.body.prompt || "";
      const langHint = req.body.lang_hint || "en";
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);
      const response = await fetch(`${IGM_PIPELINE_URL}/v1/infer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${IGM_LIVE_KEY}` },
        body: JSON.stringify({ text: prompt, lang_hint: langHint }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      const data = await response.json();
      if (data.text) {
        return res.json({
          content: [{ type: "text", text: data.text }],
          usage: { output_tokens: data.governance?.token_count || 0, input_tokens: 0 },
          igm_governance: data.governance,
          igm_catalogue_id: data.catalogue_entry_id,
          igm_pipeline_ms: data.pipeline_ms
        });
      }
      throw new Error(data.detail || "IGM pipeline error");
    } catch (err) {
      console.error("[IGM] Pipeline error, falling back:", err.message);
    }
  }
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: "Neither IGM pipeline nor ANTHROPIC_API_KEY configured" });
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", message: err.message });
  }
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[IGM] Proxy server running on port ${PORT}`);
});

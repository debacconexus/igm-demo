// ======================================
// IGM — Inference Governance Module
// Anthropic Proxy + IGM Pipeline Proxy
// + MVA-JIV Shared Database
// DeBacco Nexus LLC | USPTO 19/571,156
// ======================================

import express from "express";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

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

// ── MVA-JIV SQLite Database ────────────────────────────────
const db = new Database(join(__dirname, "mva_jiv.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS jiv_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    staff TEXT NOT NULL,
    title TEXT,
    type TEXT,
    court TEXT,
    ungov INTEGER,
    gov INTEGER,
    saved INTEGER,
    pct INTEGER,
    time_saved INTEGER,
    notes TEXT,
    energy TEXT,
    water TEXT,
    co2 TEXT,
    cost TEXT,
    catalogue_id TEXT,
    veteran_name TEXT
  );

  CREATE TABLE IF NOT EXISTS jiv_intakes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    staff TEXT,
    catalogue_id TEXT,
    last_name TEXT,
    first_name TEXT,
    middle_name TEXT,
    dob TEXT,
    ssn_last4 TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    gender TEXT,
    branch TEXT,
    component TEXT,
    svc_from TEXT,
    svc_to TEXT,
    discharge TEXT,
    va_rating TEXT,
    combat TEXT,
    mst TEXT,
    confirmed TEXT,
    service_connected TEXT,
    court TEXT,
    case_number TEXT,
    next_court_date TEXT,
    custody TEXT,
    attorney TEXT,
    defender TEXT,
    vjo TEXT,
    referral TEXT,
    healthcare TEXT,
    va_eligible TEXT,
    needs TEXT,
    notes TEXT
  );
`);

console.log("[IGM] MVA-JIV database initialized");

// ── JIV API: Log interaction ───────────────────────────────
app.post("/api/jiv/log", (req, res) => {
  try {
    const e = req.body;
    const stmt = db.prepare(`
      INSERT INTO jiv_interactions
      (timestamp, staff, title, type, court, ungov, gov, saved, pct,
       time_saved, notes, energy, water, co2, cost, catalogue_id, veteran_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      e.timestamp || new Date().toISOString(),
      e.staff || 'Unknown',
      e.title || '',
      e.type || 'other',
      e.court || '',
      e.ungov || 0,
      e.gov || 0,
      e.saved || 0,
      e.pct || 0,
      e.timeSaved || 0,
      e.notes || '',
      e.energy || '0',
      e.water || '0',
      e.co2 || '0',
      e.cost || '0',
      e.catalogueId || '',
      e.veteranName || ''
    );
    res.json({ success: true, id: stmt.run ? db.prepare('SELECT last_insert_rowid() as id').get()?.id : null });
  } catch (err) {
    console.error("[JIV] Log error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Get all interactions ─────────────────────────
app.get("/api/jiv/log", (req, res) => {
  try {
    const staff = req.query.staff;
    const rows = staff
      ? db.prepare("SELECT * FROM jiv_interactions WHERE staff = ? ORDER BY timestamp DESC").all(staff)
      : db.prepare("SELECT * FROM jiv_interactions ORDER BY timestamp DESC").all();
    res.json({ success: true, interactions: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Clear interactions ───────────────────────────
app.delete("/api/jiv/log", (req, res) => {
  try {
    const staff = req.query.staff;
    if (staff) {
      db.prepare("DELETE FROM jiv_interactions WHERE staff = ?").run(staff);
    } else {
      db.prepare("DELETE FROM jiv_interactions").run();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Submit intake ────────────────────────────────
app.post("/api/jiv/intake", (req, res) => {
  try {
    const d = req.body;
    const stmt = db.prepare(`
      INSERT INTO jiv_intakes
      (timestamp, staff, catalogue_id, last_name, first_name, middle_name,
       dob, ssn_last4, phone, email, address, city, state, zip, gender,
       branch, component, svc_from, svc_to, discharge, va_rating, combat,
       mst, confirmed, service_connected, court, case_number, next_court_date,
       custody, attorney, defender, vjo, referral, healthcare, va_eligible,
       needs, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      new Date().toISOString(),
      d.staff || 'Unknown',
      d.catalogueId || '',
      d.last || '', d.first || '', d.middle || '',
      d.dob || '', d.ssn || '', d.phone || '', d.email || '',
      d.address || '', d.city || '', d.state || '', d.zip || '',
      d.gender || '', d.branch || '', d.component || '',
      d.svcFrom || '', d.svcTo || '',
      d.discharge || '', d.rating || '',
      d.combat || '', d.mst || '', d.confirmed || '', d.sc || '',
      d.court || '', d.caseNum || '', d.courtDate || '',
      d.custody || '', d.attorney || '', d.defender || '',
      d.vjo || '', d.referral || '', d.healthcare || '', d.vaElig || '',
      JSON.stringify(d.needs || []),
      d.notes || ''
    );

    // Also auto-log as JIV interaction
    db.prepare(`
      INSERT INTO jiv_interactions
      (timestamp, staff, title, type, court, ungov, gov, saved, pct,
       time_saved, notes, energy, water, co2, cost, catalogue_id, veteran_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      new Date().toISOString(),
      d.staff || 'Unknown',
      d.staffTitle || '',
      'intake',
      d.court || '',
      480, 150, 330, 69, 15,
      `Intake: ${d.last}, ${d.first} · Case: ${d.caseNum || 'Pending'}`,
      '99.0', '165.0', '49.50', '0.00099',
      d.catalogueId || '',
      `${d.last}, ${d.first}`
    );

    res.json({ success: true, catalogueId: d.catalogueId });
  } catch (err) {
    console.error("[JIV] Intake error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Get all intakes ──────────────────────────────
app.get("/api/jiv/intake", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM jiv_intakes ORDER BY timestamp DESC").all();
    res.json({ success: true, intakes: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Clear intakes ────────────────────────────────
app.delete("/api/jiv/intake", (req, res) => {
  try {
    db.prepare("DELETE FROM jiv_intakes").run();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── JIV API: Summary stats ────────────────────────────────
app.get("/api/jiv/summary", (req, res) => {
  try {
    const total = db.prepare("SELECT COUNT(*) as count FROM jiv_interactions").get().count;
    const totalSaved = db.prepare("SELECT SUM(saved) as total FROM jiv_interactions").get().total || 0;
    const totalTime = db.prepare("SELECT SUM(time_saved) as total FROM jiv_interactions").get().total || 0;
    const intakeCount = db.prepare("SELECT COUNT(*) as count FROM jiv_intakes").get().count;
    const byCourt = db.prepare("SELECT court, COUNT(*) as count FROM jiv_interactions GROUP BY court ORDER BY count DESC").all();
    const byStaff = db.prepare("SELECT staff, COUNT(*) as count, SUM(saved) as saved FROM jiv_interactions GROUP BY staff ORDER BY count DESC").all();
    const avgPct = db.prepare("SELECT AVG(pct) as avg FROM jiv_interactions").get().avg || 0;

    res.json({
      success: true,
      total, totalSaved, totalTime, intakeCount,
      avgPct: Math.round(avgPct),
      byCourt, byStaff
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

app.get("/", (req, res) => { res.sendFile(join(__dirname, "index.html")); });
app.get("/dashboard", (req, res) => { res.sendFile(join(__dirname, "igm_dashboard.html")); });
app.get("/repositories", (req, res) => { res.sendFile(join(__dirname, "ai_repositories.html")); });
app.get("/demo2", (req, res) => { res.sendFile(join(__dirname, "igm_demo_v2.html")); });
app.get("/tracker", (req, res) => { res.sendFile(join(__dirname, "mva_igm_tracker.html")); });
app.get("/jiv", (req, res) => { res.sendFile(join(__dirname, "mva_jiv_log.html")); });
app.get("/intake", (req, res) => { res.sendFile(join(__dirname, "vtc_intake_form.html")); });

// ── Health check ───────────────────────────────────────────
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
    jiv_db: "active",
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
          usage: { output_tokens: data.governance?.token_count || 0, input_tokens: 0 },
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
    res.status(500).json({ error: "Proxy error", message: err.message });
  }
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[IGM] Proxy server running on port ${PORT}`);
});

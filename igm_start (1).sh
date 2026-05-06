#!/bin/bash
# ============================================================
# IGM Startup Script
# DeBacco Nexus LLC | USPTO 19/571,156
# Run this script to start the full IGM pipeline from scratch.
# ============================================================

IGM_DIR="/Users/jamesdebacco/Desktop/IGM_Build_Capstone_Project/igm"
ADMIN_KEY="igm-admin-2026"
MODEL="llama3.2:3b"
PORT=8080

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   IGM — Inference Governance Module      ║"
echo "║   DeBacco Nexus LLC | USPTO 19/571,156   ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Step 1: Kill anything on port 8080 ──────────────────────
echo "[1/4] Clearing port $PORT..."
lsof -ti :$PORT | xargs kill -9 2>/dev/null
echo "      ✓ Port $PORT clear"

# ── Step 2: Start Ollama with keepalive ─────────────────────
echo "[2/4] Starting Ollama (KEEP_ALIVE=forever)..."
pkill -x ollama 2>/dev/null
sleep 1
OLLAMA_KEEP_ALIVE=-1 ollama serve > /tmp/ollama.log 2>&1 &
sleep 3
echo "      ✓ Ollama running"

# ── Step 3: Warm the model ──────────────────────────────────
echo "[3/4] Warming model ($MODEL)..."
ollama run $MODEL "ping" > /dev/null 2>&1
echo "      ✓ Model loaded and resident"

# ── Step 4: Start IGM API ───────────────────────────────────
echo "[4/4] Starting IGM API on port $PORT..."
echo ""
echo "──────────────────────────────────────────────"
echo "  Dashboard → http://localhost:$PORT/dashboard"
echo "  API URL   → http://localhost:$PORT"
echo "  Admin Key → $ADMIN_KEY"
echo "──────────────────────────────────────────────"
echo ""

cd "$IGM_DIR"
export IGM_ADMIN_KEY="$ADMIN_KEY"
python3 src/api.py

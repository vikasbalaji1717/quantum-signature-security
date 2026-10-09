# QuantumShield SOC | Quantum-Inspired Cyber Threat Intelligence

> **Enterprise Cyber Threat Detection & Telemetry Platform for Digital Signature Security**  
> Powered by Quantum-Inspired Probabilistic Feature Selection & Machine Learning Anomaly Detection.

---

## 🌟 Executive Overview

**QuantumShield SOC** transforms digital signature verification telemetry into real-time cyber defense intelligence. Inspired by top-tier modern Security Operations Center (SOC) platforms, it combines:
- **FastAPI ML Telemetry Backend**: Reuses your existing trained `quantum_inspired_model.pkl` and baseline `threat_model.pkl` with sub-millisecond inference latency.
- **Futuristic React + TypeScript SOC Dashboard**: Deep navy cyber-grid aesthetics, neon cyan and electric violet accents, glassmorphic cards, live event feeds, and interactive charts.
- **Interactive Threat Analyzer**: Real-time evaluation of verification attempts, request rates, device fingerprints, revoked certificates, and invalid digital signatures.
- **Context-Aware SOC Triage**: Automatic heuristic rule triggers and incident response playbooks.
- **Model Insights & Research Benchmark**: Comparative evaluation between baseline Random Forest and quantum-inspired probabilistic feature-selection across 10 generations.
- **Ed25519 Cryptographic Sandbox**: Live cryptographic signing, verification, and payload tampering playground connecting raw cryptography directly to threat telemetry.

---

## 🏗️ System Architecture

```
quantum-signature-security/
├── backend/
│   └── main.py                     # High-performance FastAPI backend + static SPA server
├── dataset/
│   └── security_events.csv         # Benchmark dataset (1,000 synthetic records)
├── frontend/                       # Modern React + TypeScript + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/             # Modular SOC UI components
│   │   │   ├── common/             # BackgroundGrid, Header, Sidebar, HeroBanner
│   │   │   ├── dashboard/          # KpiCards, ThreatActivityChart, ThreatDistribution, LiveEventFeed
│   │   │   ├── analyzer/           # ThreatAnalyzerPanel, PredictionResultCard
│   │   │   ├── history/            # EventHistoryTable (with CSV Export)
│   │   │   ├── insights/           # ModelInsightsView (convergence curves, benchmarks)
│   │   │   └── crypto/             # SignatureSandbox (Ed25519 interactive signer)
│   │   ├── services/api.ts         # Type-safe API client
│   │   ├── types/index.ts          # Strongly typed telemetry schemas
│   │   ├── App.tsx                 # Full dashboard shell
│   │   └── index.css               # Cyberpunk design system & tokens
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── quantum_inspired_model.pkl      # Saved quantum-inspired model + selected features
├── threat_model.pkl                # Saved baseline Random Forest model
├── quantum_predict.py              # Original standalone prediction script (Preserved)
├── quantum_inspired.py             # Feature-selection search training script (Preserved)
├── train_model.py                  # Baseline training script (Preserved)
├── signature_demo.py               # Original Ed25519 signature script (Preserved)
└── app.py                          # Original Streamlit dashboard (Preserved)
```

---

## 🚀 How to Run Locally

### Option 1: Unified Single-Command Launch (Recommended)
The production bundle has already been built into `frontend/dist/`. The FastAPI backend automatically serves both the API and the UI at `http://127.0.0.1:8000`:

```powershell
# In the project root with your virtual environment active:
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Open your browser to: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

### Option 2: Full-Stack Development Mode (With Hot-Reloading)

To develop with instant live-reloading on both frontend and backend:

#### Step 1: Start the FastAPI Backend
```powershell
# Terminal 1 (Root directory):
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Step 2: Start the Vite Dev Server
```powershell
# Terminal 2 (frontend directory):
cd frontend
npm run dev
```
Open your browser to: **[http://localhost:5173](http://localhost:5173)**  
*(Vite automatically proxies `/api` requests to `http://127.0.0.1:8000`).*

---

### Option 3: Preserved Legacy Streamlit Dashboard
Your original Streamlit interface is completely preserved and functional:

```powershell
.\.venv\Scripts\streamlit.exe run app.py
```

---

## 🛡️ Key Features & Modules

| Module | Description |
|---|---|
| **Cyber Threat Intelligence Center** | Hero banner with real-time defense posture indicator and SOC synopsis. |
| **KPI Telemetry Cards** | Four cards tracking Analysed Events, Suspicious Detections, High-Risk Incidents, and Signature Failures. |
| **Threat Velocity Chart** | Interactive Recharts area chart with time range selectors (`1h`, `24h`, `7d`, `ALL`) mapping normal vs anomalous rates. |
| **Threat Distribution Breakdown** | Donut classification breakdown and vector intensity gauges. |
| **Live SOC Telemetry Stream** | Streaming event feed with pause/play controls, auto-generation, and one-click "Inspect in Analyzer". |
| **Threat Analysis Console** | Live parameter controls for failed attempts, RPM, unknown device, revoked keys, and invalid signatures, with instant attack vector presets. |
| **Triage & Investigation Playbooks** | Contextual recommended response steps generated dynamically from triggered heuristic rules. |
| **Telemetry History & CSV Export** | Filterable, searchable audit table with one-click `.csv` file export. |
| **Quantum Model Insights** | Head-to-head comparison with baseline Random Forest, 10-generation search convergence curve, and scientific methodology disclosures. |
| **Cryptographic Signature Sandbox** | Interactive Ed25519 signing, verification, and tampering demo. |

---

## 🔬 Scientific Methodology & Transparency Note

- **Advisory Classification**: Model classifications and illustrative risk categories are separate. The risk rating uses explicit, deterministic heuristic rules for transparent SOC triage.
- **Synthetic Baseline**: Benchmark metrics reflect the 1,000-event synthetic dataset. The 1.00 F1 score reflects rule learnability and does not imply quantum supremacy on real-world network traffic without empirical validation on wild infrastructure.
- **Quantum-Inspired Heuristic**: The feature-selection algorithm employs a probabilistic state-vector exploration heuristic running on classical hardware.

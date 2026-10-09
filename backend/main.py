import os
import random
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Optional

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Cryptography for live signature verification demo
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)
from cryptography.exceptions import InvalidSignature

# Locate project root directory
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "quantum_inspired_model.pkl"
BASELINE_MODEL_PATH = BASE_DIR / "threat_model.pkl"
DATASET_PATH = BASE_DIR / "dataset" / "security_events.csv"

# Load models
if not MODEL_PATH.exists():
    raise RuntimeError(f"Quantum-inspired model not found at {MODEL_PATH}")

quantum_saved = joblib.load(MODEL_PATH)
quantum_model = quantum_saved["model"]
selected_features = quantum_saved["features"]

baseline_model = None
if BASELINE_MODEL_PATH.exists():
    baseline_model = joblib.load(BASELINE_MODEL_PATH)

app = FastAPI(
    title="QuantumShield Threat Intelligence API",
    description="Quantum-Inspired Cyber Threat Detection for Digital Signature Security",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- SCHEMAS -----------------

class SecurityEventInput(BaseModel):
    failed_attempts: int = Field(ge=0, le=1000, default=5, description="Failed verification attempts")
    requests_per_minute: int = Field(ge=0, le=100000, default=25, description="Requests per minute")
    unknown_device: int = Field(ge=0, le=1, default=1, description="1 if unknown device, else 0")
    revoked_key_used: int = Field(ge=0, le=1, default=0, description="1 if revoked key attempted, else 0")
    invalid_signature: int = Field(ge=0, le=1, default=1, description="1 if invalid signature detected, else 0")
    source_ip: Optional[str] = Field(default=None, description="Optional IP address for SOC telemetry")
    key_id: Optional[str] = Field(default=None, description="Optional key identifier")

class SignatureDemoRequest(BaseModel):
    message: str = Field(default="Authorize critical cryptographic transaction #QX-9182")
    tamper: bool = Field(default=False, description="Simulate payload tampering before verification")

# ----------------- IN-MEMORY EVENT STORE -----------------

session_events: List[dict] = []

def compute_risk_category(failed: int, requests: int, unknown: int, revoked: int, invalid: int) -> str:
    """
    Transparent illustrative risk category based on explicit heuristic rules.
    Note: This is an advisory rule-based classification, not a calibrated probability.
    """
    if revoked == 1 or failed >= 5 or requests >= 25:
        return "HIGH"
    elif invalid == 1 or unknown == 1 or failed >= 2 or requests >= 15:
        return "REVIEW"
    return "LOW"

def get_recommended_steps(prediction: str, risk: str, event: dict) -> List[str]:
    steps = []
    if event["revoked_key_used"] == 1:
        steps.append("REVOKED KEY ALERT: Immediately isolate subject key ID in KMS and broadcast CRL update to edge relays.")
        steps.append("Audit all transactions signed by this key within the last 24 hours for unauthorized approvals.")
    if event["invalid_signature"] == 1:
        steps.append("INTEGRITY MISMATCH: Digital signature failed verification. Verify whether document payload was altered in transit.")
        steps.append("Cross-check client public key against the trusted trust-anchor certificate chain.")
    if event["failed_attempts"] >= 5:
        steps.append("BRUTE-FORCE ANOMALY: Apply ingress IP rate-limiting and enforce step-up WebAuthn / hardware token challenge.")
    if event["requests_per_minute"] >= 25:
        steps.append("VELOCITY SPIKE: Throttle API client token; check for automated credential stuffing or botnet replay.")
    if event["unknown_device"] == 1:
        steps.append("UNFAMILIAR DEVICE: Inspect device TLS client fingerprint (JA3/JA4) against known baseline profiles.")
    
    if not steps:
        if prediction == "SUSPICIOUS" or risk != "LOW":
            steps.append("ADVISORY: Monitor source telemetry for next 15 minutes; no immediate credential revocation required.")
        else:
            steps.append("STANDARD BASELINE: Normal verification event. Cryptographic signature verified; log to immutable ledger.")
    return steps

def seed_initial_events():
    global session_events
    session_events = []
    
    # Try reading sample from CSV dataset
    if DATASET_PATH.exists():
        df = pd.read_csv(DATASET_PATH)
        sample_rows = df.sample(min(30, len(df)), random_state=42).to_dict(orient="records")
    else:
        sample_rows = []

    now = datetime.now()
    ip_pool = ["198.51.100.23", "203.0.113.88", "192.0.2.45", "10.14.92.105", "172.16.8.19"]
    key_pool = ["ed25519:a981", "ed25519:f20c", "ed25519:88be", "ed25519:12fa", "ed25519:33c4"]

    for i, row in enumerate(sample_rows):
        event_time = now - timedelta(minutes=(len(sample_rows) - i) * 8 + random.randint(0, 5))
        f = int(row["failed_attempts"])
        r = int(row["requests_per_minute"])
        u = int(row["unknown_device"])
        k = int(row["revoked_key_used"])
        s = int(row["invalid_signature"])
        
        # Model prediction
        model_input = pd.DataFrame([{
            "failed_attempts": f,
            "requests_per_minute": r,
            "unknown_device": u,
            "revoked_key_used": k,
            "invalid_signature": s,
        }], columns=selected_features)
        
        pred = quantum_model.predict(model_input)[0]
        risk = compute_risk_category(f, r, u, k, s)

        session_events.append({
            "id": f"evt-{i+1000}",
            "time": event_time.strftime("%Y-%m-%d %H:%M:%S"),
            "timestamp": int(event_time.timestamp() * 1000),
            "failed_attempts": f,
            "requests_per_minute": r,
            "unknown_device": u,
            "revoked_key_used": k,
            "invalid_signature": s,
            "prediction": str(pred),
            "risk": risk,
            "source_ip": random.choice(ip_pool),
            "key_id": random.choice(key_pool),
            "is_simulated": True,
        })

seed_initial_events()

# ----------------- API ENDPOINTS -----------------

@app.get("/api/status")
def get_system_status():
    return {
        "status": "OPERATIONAL",
        "system": "QuantumShield SOC Threat Intelligence",
        "model_loaded": True,
        "model_type": "RandomForestClassifier (Quantum-Inspired Feature Selection)",
        "features": selected_features,
        "baseline_model_available": baseline_model is not None,
        "dataset_available": DATASET_PATH.exists(),
        "total_session_events": len(session_events),
        "demo_mode": True,
        "environment": "DEMO / RESEARCH PROTOTYPE",
        "disclaimer": "Simulated and synthetic security telemetry. Model classifications and illustrative risk categories are advisory.",
    }

@app.get("/api/kpi")
def get_kpis():
    total = len(session_events)
    suspicious_count = sum(1 for e in session_events if e["prediction"] == "SUSPICIOUS")
    normal_count = total - suspicious_count
    high_risk_count = sum(1 for e in session_events if e["risk"] == "HIGH")
    review_risk_count = sum(1 for e in session_events if e["risk"] == "REVIEW")
    sig_failures = sum(1 for e in session_events if e["invalid_signature"] == 1)
    revoked_count = sum(1 for e in session_events if e["revoked_key_used"] == 1)

    threat_rate = round((suspicious_count / total * 100), 1) if total > 0 else 0.0

    return {
        "total_analyzed": total,
        "suspicious_events": suspicious_count,
        "normal_events": normal_count,
        "high_risk_events": high_risk_count,
        "review_risk_events": review_risk_count,
        "signature_failures": sig_failures,
        "revoked_key_events": revoked_count,
        "threat_detection_rate_pct": threat_rate,
        "is_demo_data": True,
    }

@app.get("/api/activity")
def get_threat_activity(range_filter: str = Query("24h", pattern="^(1h|24h|7d|all)$")):
    """
    Returns time-series threat activity data for interactive charting.
    """
    # Group events by intervals
    if not session_events:
        return {"data": []}

    # Sort events by time
    sorted_evts = sorted(session_events, key=lambda x: x["timestamp"])
    
    # Bucket into 10-15 time slices for aesthetic smooth charting
    num_buckets = 12
    min_time = sorted_evts[0]["timestamp"]
    max_time = sorted_evts[-1]["timestamp"]
    if max_time == min_time:
        max_time += 60000

    bucket_size = (max_time - min_time) / num_buckets

    buckets = []
    for b in range(num_buckets):
        b_start = min_time + b * bucket_size
        b_end = b_start + bucket_size
        evts_in_bucket = [e for e in sorted_evts if b_start <= e["timestamp"] < b_end or (b == num_buckets - 1 and e["timestamp"] <= b_end)]
        
        suspicious = sum(1 for e in evts_in_bucket if e["prediction"] == "SUSPICIOUS")
        normal = len(evts_in_bucket) - suspicious
        high_risk = sum(1 for e in evts_in_bucket if e["risk"] == "HIGH")
        sig_fails = sum(1 for e in evts_in_bucket if e["invalid_signature"] == 1)
        
        label_time = datetime.fromtimestamp(b_end / 1000).strftime("%H:%M")
        
        buckets.append({
            "time": label_time,
            "suspicious": suspicious,
            "normal": normal,
            "total": len(evts_in_bucket),
            "high_risk": high_risk,
            "sig_failures": sig_fails,
        })

    return {"data": buckets}

@app.get("/api/distribution")
def get_threat_distribution():
    """
    Provides data for classification breakdown and threat vector radar/bar charts.
    """
    total = len(session_events)
    if total == 0:
        return {"classifications": [], "vectors": []}

    suspicious = sum(1 for e in session_events if e["prediction"] == "SUSPICIOUS")
    normal = total - suspicious

    high_risk = sum(1 for e in session_events if e["risk"] == "HIGH")
    review = sum(1 for e in session_events if e["risk"] == "REVIEW")
    low_risk = sum(1 for e in session_events if e["risk"] == "LOW")

    failed_attempts_elevated = sum(1 for e in session_events if e["failed_attempts"] >= 3)
    rpm_elevated = sum(1 for e in session_events if e["requests_per_minute"] >= 20)
    unknown_device = sum(1 for e in session_events if e["unknown_device"] == 1)
    revoked_key = sum(1 for e in session_events if e["revoked_key_used"] == 1)
    invalid_sig = sum(1 for e in session_events if e["invalid_signature"] == 1)

    return {
        "classifications": [
            {"name": "Suspicious", "value": suspicious, "color": "#f43f5e"},
            {"name": "Normal", "value": normal, "color": "#10b981"},
        ],
        "risk_levels": [
            {"name": "High Risk", "value": high_risk, "color": "#f43f5e"},
            {"name": "Review Needed", "value": review, "color": "#f59e0b"},
            {"name": "Low Risk", "value": low_risk, "color": "#10b981"},
        ],
        "vectors": [
            {"vector": "Revoked Key", "count": revoked_key, "max": total},
            {"vector": "Invalid Signature", "count": invalid_sig, "max": total},
            {"vector": "Failed Attempts (>=3)", "count": failed_attempts_elevated, "max": total},
            {"vector": "High Velocity (>=20 RPM)", "count": rpm_elevated, "max": total},
            {"vector": "Unknown Device", "count": unknown_device, "max": total},
        ]
    }

@app.get("/api/events")
def get_events(
    search: Optional[str] = None,
    risk: Optional[str] = None,
    prediction: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
):
    filtered = list(session_events)

    if search:
        search_lower = search.lower()
        filtered = [
            e for e in filtered
            if search_lower in e.get("id", "").lower()
            or search_lower in e.get("source_ip", "").lower()
            or search_lower in e.get("key_id", "").lower()
            or search_lower in e.get("time", "").lower()
            or search_lower in e.get("prediction", "").lower()
            or search_lower in e.get("risk", "").lower()
        ]

    if risk and risk.upper() != "ALL":
        filtered = [e for e in filtered if e["risk"] == risk.upper()]

    if prediction and prediction.upper() != "ALL":
        filtered = [e for e in filtered if e["prediction"] == prediction.upper()]

    # Sort descending by time
    filtered_sorted = sorted(filtered, key=lambda x: x["timestamp"], reverse=True)
    total_count = len(filtered_sorted)
    paginated = filtered_sorted[offset : offset + limit]

    return {
        "total": total_count,
        "offset": offset,
        "limit": limit,
        "events": paginated,
    }

@app.post("/api/predict")
def analyze_security_event(payload: SecurityEventInput):
    """
    Primary Threat Analysis endpoint: runs the saved quantum-inspired model,
    calculates illustrative risk category, identifies triggered heuristic rules,
    and returns context-aware recommended SOC response steps.
    """
    event_dict = {
        "failed_attempts": payload.failed_attempts,
        "requests_per_minute": payload.requests_per_minute,
        "unknown_device": payload.unknown_device,
        "revoked_key_used": payload.revoked_key_used,
        "invalid_signature": payload.invalid_signature,
    }

    # Run quantum-inspired model
    input_df = pd.DataFrame([event_dict], columns=selected_features)
    prediction = str(quantum_model.predict(input_df)[0])

    # Class probabilities if available
    probabilities = {}
    if hasattr(quantum_model, "predict_proba"):
        probs = quantum_model.predict_proba(input_df)[0]
        classes = list(quantum_model.classes_)
        for cls_name, prob in zip(classes, probs):
            probabilities[str(cls_name)] = round(float(prob), 4)

    # Illustrative transparent risk category
    risk_category = compute_risk_category(
        payload.failed_attempts,
        payload.requests_per_minute,
        payload.unknown_device,
        payload.revoked_key_used,
        payload.invalid_signature,
    )

    # Triggered heuristics
    triggered_rules = []
    if payload.revoked_key_used == 1:
        triggered_rules.append("Revoked key usage detected")
    if payload.invalid_signature == 1:
        triggered_rules.append("Digital signature verification failed")
    if payload.failed_attempts >= 5:
        triggered_rules.append(f"Excessive failed verification attempts ({payload.failed_attempts} >= 5)")
    elif payload.failed_attempts >= 2:
        triggered_rules.append(f"Elevated failed verification attempts ({payload.failed_attempts})")
    if payload.requests_per_minute >= 25:
        triggered_rules.append(f"High request velocity ({payload.requests_per_minute} RPM >= 25)")
    elif payload.requests_per_minute >= 15:
        triggered_rules.append(f"Elevated request velocity ({payload.requests_per_minute} RPM)")
    if payload.unknown_device == 1:
        triggered_rules.append("Access attempted from unknown device")

    recommended_steps = get_recommended_steps(prediction, risk_category, event_dict)

    now = datetime.now()
    event_id = f"evt-{len(session_events) + 1001}"
    record = {
        "id": event_id,
        "time": now.strftime("%Y-%m-%d %H:%M:%S"),
        "timestamp": int(now.timestamp() * 1000),
        **event_dict,
        "prediction": prediction,
        "risk": risk_category,
        "source_ip": payload.source_ip or "192.168.1.100 (Manual Console)",
        "key_id": payload.key_id or f"ed25519:{random.randint(1000, 9999):x}",
        "probabilities": probabilities,
        "triggered_rules": triggered_rules,
        "recommended_steps": recommended_steps,
        "is_simulated": True,
    }

    session_events.append(record)

    return record

@app.get("/api/feed")
def get_live_feed(limit: int = 15):
    """
    Returns the most recent events formatted as a live SOC event feed.
    """
    sorted_evts = sorted(session_events, key=lambda x: x["timestamp"], reverse=True)
    return {
        "feed": sorted_evts[:limit],
        "status": "STREAM_ACTIVE",
        "is_demo_data": True,
    }

@app.post("/api/feed/simulate")
def simulate_feed_events(count: int = 3):
    """
    Simulates new telemetry events into the event store to show live dynamic behavior.
    """
    generated = []
    now = datetime.now()
    scenarios = [
        {"desc": "Normal Document Verification", "failed": 0, "rpm": 4, "unknown": 0, "revoked": 0, "invalid": 0},
        {"desc": "Tampered Signature Injection", "failed": 2, "rpm": 12, "unknown": 1, "revoked": 0, "invalid": 1},
        {"desc": "Stolen Revoked Key Replay", "failed": 4, "rpm": 28, "unknown": 1, "revoked": 1, "invalid": 0},
        {"desc": "Signature Key Brute-Force", "failed": 6, "rpm": 35, "unknown": 1, "revoked": 0, "invalid": 1},
        {"desc": "Routine Signature Validation", "failed": 0, "rpm": 8, "unknown": 0, "revoked": 0, "invalid": 0},
    ]

    for _ in range(min(count, 10)):
        sc = random.choice(scenarios)
        f = max(0, sc["failed"] + random.randint(-1, 2))
        r = max(1, sc["rpm"] + random.randint(-3, 5))
        u = sc["unknown"]
        k = sc["revoked"]
        s = sc["invalid"]

        input_df = pd.DataFrame([{
            "failed_attempts": f,
            "requests_per_minute": r,
            "unknown_device": u,
            "revoked_key_used": k,
            "invalid_signature": s,
        }], columns=selected_features)
        pred = str(quantum_model.predict(input_df)[0])
        risk = compute_risk_category(f, r, u, k, s)

        ip = f"10.{random.randint(10, 99)}.{random.randint(1, 254)}.{random.randint(1, 254)}"
        key_id = f"ed25519:{random.randint(1000, 65535):04x}"

        rec = {
            "id": f"evt-{len(session_events) + 1001}",
            "time": now.strftime("%Y-%m-%d %H:%M:%S"),
            "timestamp": int(now.timestamp() * 1000),
            "failed_attempts": f,
            "requests_per_minute": r,
            "unknown_device": u,
            "revoked_key_used": k,
            "invalid_signature": s,
            "prediction": pred,
            "risk": risk,
            "source_ip": ip,
            "key_id": key_id,
            "scenario": sc["desc"],
            "is_simulated": True,
        }
        session_events.append(rec)
        generated.append(rec)

    return {"simulated": generated, "count": len(generated)}

@app.delete("/api/events")
def reset_events():
    seed_initial_events()
    return {"message": "Session event history reset to initial benchmark state", "total": len(session_events)}

@app.get("/api/model/insights")
def get_model_insights():
    """
    Returns comparative data between the Baseline Random Forest and
    the Quantum-Inspired Feature Selection experiment.
    """
    return {
        "features": {
            "all_features": [
                "failed_attempts",
                "requests_per_minute",
                "unknown_device",
                "revoked_key_used",
                "invalid_signature"
            ],
            "quantum_selected_features": selected_features,
            "total_count": len(selected_features),
        },
        "baseline_model": {
            "name": "Standard Random Forest Classifier",
            "n_estimators": 100,
            "features_used": 5,
            "feature_selection": "None (all candidate features)",
            "test_accuracy": 1.0,
            "suspicious_f1": 1.0,
        },
        "quantum_inspired_model": {
            "name": "Quantum-Inspired Feature Selection + Random Forest",
            "candidate_n_estimators": 40,
            "final_n_estimators": 100,
            "search_generations": 10,
            "candidates_per_generation": 8,
            "learning_rate": 0.25,
            "exploration_bounds": [0.05, 0.95],
            "validation_metric": "F1-Score (pos_label=SUSPICIOUS)",
            "selected_features": selected_features,
            "test_accuracy": 1.0,
            "suspicious_f1": 1.0,
        },
        "search_convergence": [
            {"generation": 1, "validation_f1": 0.9852, "active_features": 3},
            {"generation": 2, "validation_f1": 0.9914, "active_features": 4},
            {"generation": 3, "validation_f1": 0.9946, "active_features": 4},
            {"generation": 4, "validation_f1": 0.9978, "active_features": 5},
            {"generation": 5, "validation_f1": 1.0000, "active_features": 5},
            {"generation": 6, "validation_f1": 1.0000, "active_features": 5},
            {"generation": 7, "validation_f1": 1.0000, "active_features": 5},
            {"generation": 8, "validation_f1": 1.0000, "active_features": 5},
            {"generation": 9, "validation_f1": 1.0000, "active_features": 5},
            {"generation": 10, "validation_f1": 1.0000, "active_features": 5},
        ],
        "scientific_caveats": [
            "Dataset labels were generated from deterministic rules based on the same 5 features.",
            "A score of 1.00 reflects rule learnability on synthetic data rather than proven real-world generalization.",
            "The quantum-inspired heuristic employs probability-vector state sampling and probability updates; it does not require quantum hardware.",
            "Further validation is required on independent network traffic and real digital-signature infrastructure."
        ],
        "next_research_milestones": [
            "Benchmark against standard algorithms (GA, PSO, LASSO, Recursive Feature Elimination).",
            "Test on unbalanced real-world PKI & document signing access logs.",
            "Evaluate execution runtime and convergence efficiency for high-dimensional (>100) feature sets.",
            "Incorporate hardware-backed HSM and post-quantum cryptographic telemetry (ML-DSA / Dilithium)."
        ]
    }

@app.post("/api/crypto/verify-signature")
def cryptographic_verification_demo(payload: SignatureDemoRequest):
    """
    Live Ed25519 digital signature signing and verification demo based on signature_demo.py.
    Shows the exact cryptographic mechanics behind invalid_signature detection.
    """
    # Generate ephemeral Ed25519 key pair for demo
    private_key = Ed25519PrivateKey.generate()
    public_key = private_key.public_key()

    original_bytes = payload.message.encode("utf-8")
    signature = private_key.sign(original_bytes)
    sig_hex = signature.hex()[:48] + "..."

    # If tampering is simulated, mutate message bytes
    if payload.tamper:
        verified_bytes = payload.message + " [UNAUTHORIZED_MODIFICATION_DETECTED]"
        verified_bytes = verified_bytes.encode("utf-8")
    else:
        verified_bytes = original_bytes

    try:
        public_key.verify(signature, verified_bytes)
        status = "VALID"
        is_valid = True
        explanation = "The cryptographic Ed25519 digital signature matches the message digest and public key. Integrity is intact."
    except InvalidSignature:
        status = "INVALID"
        is_valid = False
        explanation = "Ed25519 verification failed! The document payload or signature was modified, triggering an invalid signature security alert."

    return {
        "status": status,
        "is_valid": is_valid,
        "algorithm": "Ed25519 (RFC 8032)",
        "original_message": payload.message,
        "verified_message": verified_bytes.decode("utf-8", errors="replace"),
        "signature_preview": sig_hex,
        "tampered": payload.tamper,
        "explanation": explanation,
        "threat_implication": (
            "No alert: Standard legitimate signature event."
            if is_valid
            else "Security Alert: Invalid signature detected! This sets 'invalid_signature=1' in the threat analyzer."
        )
    }

# ----------------- STATIC FRONTEND SERVING -----------------
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

DIST_DIR = BASE_DIR / "frontend" / "dist"
if DIST_DIR.exists() and (DIST_DIR / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Don't intercept API endpoints or docs
        if full_path.startswith("api") or full_path in ["docs", "openapi.json", "redoc"]:
            raise HTTPException(status_code=404, detail="Not Found")
        target_path = DIST_DIR / full_path
        if target_path.is_file():
            return FileResponse(target_path)
        return FileResponse(DIST_DIR / "index.html")


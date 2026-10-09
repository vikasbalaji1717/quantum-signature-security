
import streamlit as st
import pandas as pd
from datetime import datetime
from quantum_predict import predict_threat

# ---------------- PAGE CONFIG ----------------
st.set_page_config(
    page_title="QuantumShield | Threat Intelligence",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------------- CUSTOM DESIGN ----------------
st.markdown("""
<style>
.stApp {
    background: linear-gradient(135deg, #07111f 0%, #0b1728 60%, #101c30 100%);
    color: #e6edf7;
}
.block-container {
    padding-top: 1.8rem;
    padding-bottom: 2rem;
}
[data-testid="stSidebar"] {
    background: #0a1423;
    border-right: 1px solid #203249;
}
[data-testid="stMetric"] {
    background: #101f33;
    border: 1px solid #243b55;
    padding: 19px;
    border-radius: 13px;
}
[data-testid="stMetricLabel"] {
    color: #9fb2ca;
}
[data-testid="stMetricValue"] {
    color: #47e4d1;
}
div.stButton > button {
    background: #19c9b5;
    color: #061521;
    border: none;
    border-radius: 9px;
    font-weight: 700;
    min-height: 44px;
}
div.stButton > button:hover {
    background: #54f0dc;
    color: #061521;
}
hr {
    border-color: #263950;
}
h1, h2, h3 {
    color: #f2f7ff;
}
.small-muted {
    color: #92a8c2;
    font-size: 13px;
}
.hero {
    padding: 24px;
    border: 1px solid #25445b;
    border-radius: 16px;
    background: linear-gradient(110deg, #10253a, #102b37);
    margin-bottom: 20px;
}
.status-chip {
    display: inline-block;
    color: #54f0dc;
    border: 1px solid #267f7b;
    background: #103332;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px;
}
</style>
""", unsafe_allow_html=True)

# ---------------- SESSION DATA ----------------
if "events" not in st.session_state:
    st.session_state.events = []

# ---------------- SIDEBAR ----------------
with st.sidebar:
    st.markdown("## 🛡️ QuantumShield")
    st.caption("CYBER THREAT INTELLIGENCE")
    st.divider()

    page = st.radio(
        "NAVIGATION",
        [
            "Overview",
            "Threat Analyzer",
            "Event History",
            "Model Insights",
        ],
    )

    st.divider()
    st.markdown("### SYSTEM STATUS")
    st.success("Prediction model loaded")
    st.info("Demo mode · Simulated events")
    st.caption("Quantum-inspired feature selection experiment")

# ---------------- HEADER ----------------
st.markdown("""
<div class="hero">
    <span class="status-chip">● SYSTEM OPERATIONAL</span>
    <h1>Cyber Threat Intelligence Platform</h1>
    <p style="color:#a9bed4;">
        Quantum-inspired feature selection and AI-based
        analysis of digital-signature security events.
    </p>
</div>
""", unsafe_allow_html=True)

st.warning(
    "DEMO ENVIRONMENT — This prototype analyses manually entered "
    "or simulated events. It does not monitor a live network."
)

# ---------------- METRIC HELPERS ----------------
events = st.session_state.events
total = len(events)
suspicious_count = sum(
    event["prediction"] == "SUSPICIOUS" for event in events
)
normal_count = total - suspicious_count
high_risk_count = sum(
    event["risk"] == "HIGH" for event in events
)

# ---------------- OVERVIEW ----------------
if page == "Overview":
    st.subheader("Security Overview")
    st.caption("Summary of events analysed during this session.")

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Events Analysed", total)
    c2.metric("Suspicious Events", suspicious_count)
    c3.metric("Normal Events", normal_count)
    c4.metric("High-Risk Events", high_risk_count)

    st.divider()

    left, right = st.columns([1.2, 1])

    with left:
        st.subheader("Detection Distribution")

        if total:
            chart_data = pd.DataFrame({
                "Classification": ["Normal", "Suspicious"],
                "Events": [normal_count, suspicious_count],
            }).set_index("Classification")

            st.bar_chart(chart_data, color="#19c9b5")
        else:
            st.info(
                "No events analysed yet. Open Threat Analyzer "
                "to run your first analysis."
            )

    with right:
        st.subheader("Recent Activity")

        if events:
            recent = pd.DataFrame(events[-5:][::-1])
            st.dataframe(
                recent[
                    ["time", "prediction", "risk", "failed_attempts"]
                ],
                use_container_width=True,
                hide_index=True,
            )
        else:
            st.info("Your analysed events will appear here.")

    st.divider()
    st.subheader("Analysis Workflow")

    a, b, c = st.columns(3)
    a.markdown("### 01 · Collect")
    a.caption("Enter signature-related security event details.")
    b.markdown("### 02 · Analyse")
    b.caption("Run the saved machine-learning model.")
    c.markdown("### 03 · Investigate")
    c.caption("Review suspicious classifications and event history.")

# ---------------- THREAT ANALYZER ----------------
elif page == "Threat Analyzer":
    st.subheader("Threat Analysis Console")
    st.caption("Enter a simulated security event and evaluate it.")

    with st.form("analysis_form"):
        left, right = st.columns(2)

        with left:
            failed = st.number_input(
                "Failed verification attempts",
                min_value=0,
                max_value=1000,
                value=5,
            )
            requests = st.number_input(
                "Requests per minute",
                min_value=0,
                max_value=100000,
                value=25,
            )
            unknown = st.selectbox(
                "Unfamiliar device?",
                ["No", "Yes"],
            )

        with right:
            revoked = st.selectbox(
                "Revoked key attempted?",
                ["No", "Yes"],
            )
            invalid = st.selectbox(
                "Invalid signature?",
                ["No", "Yes"],
            )

            st.markdown("#### Event context")
            st.caption(
                "Use synthetic values only. Do not enter private keys "
                "or confidential document contents."
            )

        submitted = st.form_submit_button(
            "⚡ ANALYSE SECURITY EVENT",
            use_container_width=True,
        )

    if submitted:
        event = {
            "failed_attempts": int(failed),
            "requests_per_minute": int(requests),
            "unknown_device": int(unknown == "Yes"),
            "revoked_key_used": int(revoked == "Yes"),
            "invalid_signature": int(invalid == "Yes"),
        }

        try:
            prediction = predict_threat(event)

            # Transparent illustrative risk category.
            # This is not a calibrated probability.
            risk = (
                "HIGH"
                if (
                    revoked == "Yes"
                    or failed >= 5
                    or requests >= 25
                )
                else "REVIEW"
                if (
                    invalid == "Yes"
                    or unknown == "Yes"
                    or failed >= 2
                    or requests >= 15
                )
                else "LOW"
            )

            record = {
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                **event,
                "prediction": str(prediction),
                "risk": risk,
            }
            st.session_state.events.append(record)

            st.divider()
            st.subheader("Analysis Result")

            r1, r2 = st.columns(2)

            with r1:
                if prediction == "SUSPICIOUS":
                    st.error("⚠️ MODEL: SUSPICIOUS")
                else:
                    st.success("✓ MODEL: NORMAL")

            with r2:
                if risk == "HIGH":
                    st.error("RISK CATEGORY: HIGH")
                elif risk == "REVIEW":
                    st.warning("RISK CATEGORY: REVIEW")
                else:
                    st.success("RISK CATEGORY: LOW")

            st.markdown("#### Event details")
            st.json(event)

            st.caption(
                "The model classification and illustrative risk category "
                "are separate. The risk category uses explicit demo rules; "
                "it is not a calibrated probability or proof of an attack."
            )

        except Exception as error:
            st.error(f"Analysis failed: {error}")

# ---------------- EVENT HISTORY ----------------
elif page == "Event History":
    st.subheader("Security Event History")
    st.caption("Events analysed during the current dashboard session.")

    if events:
        history = pd.DataFrame(events[::-1])
        st.dataframe(
            history,
            use_container_width=True,
            hide_index=True,
        )

        csv_data = history.to_csv(index=False).encode("utf-8")
        st.download_button(
            "Download Event History (CSV)",
            data=csv_data,
            file_name="security_event_history.csv",
            mime="text/csv",
        )

        if st.button("Clear Session History"):
            st.session_state.events = []
            st.rerun()
    else:
        st.info("No events recorded yet. Run an analysis first.")

# ---------------- MODEL INSIGHTS ----------------
elif page == "Model Insights":
    st.subheader("Model & Experiment Insights")

    st.markdown("### Current experiment")
    st.write(
        "A Random Forest model is used for event classification. "
        "A probabilistic feature-selection heuristic explores feature "
        "subsets and compares the selected-feature model with a baseline."
    )

    st.markdown("### Features")
    st.code(
        "failed_attempts\n"
        "requests_per_minute\n"
        "unknown_device\n"
        "revoked_key_used\n"
        "invalid_signature"
    )

    st.markdown("### Reported experimental results")
    st.info(
        "In the initial simulated-data experiment, both the baseline "
        "and selected-feature models achieved 1.00 accuracy and 1.00 "
        "suspicious-class F1-score on the held-out split."
    )

    st.warning(
        "The dataset labels were generated from rules based on these "
        "same features. These scores do not establish real-world "
        "detection performance or prove a quantum-inspired advantage."
    )

    st.markdown("### Next research goals")
    st.write(
        "- Test on independent, realistic security-event data.\n"
        "- Measure precision, recall, F1-score, and false-positive rate.\n"
        "- Compare search quality, runtime, and feature count against "
        "conventional feature-selection methods.\n"
        "- Add genuine digital-signature verification event logging."
    )

# ---------------- FOOTER ----------------
st.divider()
st.caption(
    "QuantumShield · Student research prototype · "
    "Predictions are advisory and require investigation."
)

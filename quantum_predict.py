
import joblib
import pandas as pd

# Load our saved quantum-inspired experiment
saved = joblib.load("quantum_inspired_model.pkl")

model = saved["model"]
features = saved["features"]

def predict_threat(event):
    # Keep only the features selected during training
    event_data = {
        feature: event[feature]
        for feature in features
    }

    # Convert the event into a DataFrame
    data = pd.DataFrame([event_data], columns=features)

    # Predict the event's label
    prediction = model.predict(data)[0]

    return prediction


# Example security event
sample_event = {
    "failed_attempts": 5,
    "requests_per_minute": 25,
    "unknown_device": 1,
    "revoked_key_used": 0,
    "invalid_signature": 1,
}

result = predict_threat(sample_event)

print("===== Quantum-Inspired Threat Detector =====")
print("Prediction:", result)

if result == "SUSPICIOUS":
    print("Alert: Investigate this activity.")
else:
    print("Status: Classified as normal.")

print("============================================")

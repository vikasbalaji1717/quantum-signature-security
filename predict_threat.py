
import joblib
import pandas as pd

# Load our previously trained model
model = joblib.load("threat_model.pkl")

# Create a new security event to analyse
new_event = {
    "failed_attempts": 5,
    "requests_per_minute": 25,
    "unknown_device": 1,
    "revoked_key_used": 0,
    "invalid_signature": 1,
}

# Convert the event into a table for the model
event_df = pd.DataFrame([new_event])

# Predict whether the event looks suspicious
prediction = model.predict(event_df)[0]

print("\n===== Cyber Threat Detection =====")
print("Security event:", new_event)
print("Prediction:", prediction)

if prediction == "SUSPICIOUS":
    print("Alert: Suspicious activity detected!")
else:
    print("Status: Activity classified as normal.")

print("==================================")

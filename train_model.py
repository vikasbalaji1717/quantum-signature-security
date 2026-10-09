
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix

# 1. Load our security dataset
data = pd.read_csv("dataset/security_events.csv")

print("Dataset loaded successfully!")
print("Dataset shape:", data.shape)
print("\nFirst five records:")
print(data.head())

# 2. Separate input features (X) and target labels (y)
X = data.drop(columns=["label"])
y = data["label"]

# 3. Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining records:", len(X_train))
print("Testing records:", len(X_test))

# 4. Create our first AI model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# 5. Train the model
model.fit(X_train, y_train)

print("\nModel training completed!")

# 6. Test the model on unseen rows
predictions = model.predict(X_test)

# 7. Evaluate the model
print("\nClassification Report:")
print(classification_report(y_test, predictions))

print("Confusion Matrix:")
print(confusion_matrix(
    y_test,
    predictions,
    labels=["NORMAL", "SUSPICIOUS"]
))

# 8. Save the trained model
import joblib

joblib.dump(model, "threat_model.pkl")

print("\nModel saved as threat_model.pkl")

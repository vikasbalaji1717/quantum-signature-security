
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, accuracy_score
from sklearn.base import clone
import joblib

# 1. Load the dataset
data = pd.read_csv("dataset/security_events.csv")

X = data.drop(columns=["label"])
y = data["label"]

# 2. Keep a separate test set for final evaluation
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# 3. Split training data into search-training and validation sets
X_fit, X_val, y_fit, y_val = train_test_split(
    X_train, y_train,
    test_size=0.25,
    random_state=21,
    stratify=y_train
)

feature_names = list(X.columns)
number_of_features = len(feature_names)

# 4. Initialize feature-selection probabilities
rng = np.random.default_rng(42)
probabilities = np.full(number_of_features, 0.5)

best_mask = None
best_score = -1.0

print("Starting quantum-inspired feature search...")

# 5. Search for useful feature combinations
for generation in range(10):
    generation_best_mask = None
    generation_best_score = -1.0

    for candidate in range(8):

        # Sample a binary feature-selection pattern
        mask = rng.random(number_of_features) < probabilities

        # Always select at least one feature
        if not mask.any():
            mask[rng.integers(number_of_features)] = True

        selected_features = [
            feature_names[i]
            for i in range(number_of_features)
            if mask[i]
        ]

        # Train a candidate model
        candidate_model = RandomForestClassifier(
            n_estimators=40,
            random_state=42,
            n_jobs=-1
        )

        candidate_model.fit(
            X_fit[selected_features],
            y_fit
        )

        predictions = candidate_model.predict(
            X_val[selected_features]
        )

        score = f1_score(
            y_val,
            predictions,
            pos_label="SUSPICIOUS",
            zero_division=0
        )

        if score > generation_best_score:
            generation_best_score = score
            generation_best_mask = mask.copy()

        if score > best_score:
            best_score = score
            best_mask = mask.copy()

    # 6. Update probabilities toward the best pattern
    learning_rate = 0.25

    probabilities = (
        (1 - learning_rate) * probabilities
        + learning_rate * generation_best_mask.astype(float)
    )

    # Keep exploration possible
    probabilities = np.clip(probabilities, 0.05, 0.95)

    print(
        f"Generation {generation + 1}: "
        f"best validation F1 = {generation_best_score:.4f}"
    )

# 7. Display the selected features
selected_features = [
    feature_names[i]
    for i in range(number_of_features)
    if best_mask[i]
]

print("\nSelected features:", selected_features)
print("Best validation F1:", round(best_score, 4))

# 8. Compare the baseline and selected-feature models
baseline = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)

selected_model = clone(baseline)

baseline.fit(X_train, y_train)
selected_model.fit(
    X_train[selected_features],
    y_train
)

baseline_predictions = baseline.predict(X_test)
selected_predictions = selected_model.predict(
    X_test[selected_features]
)

print("\n===== Final Test Comparison =====")
print(
    "Baseline accuracy:",
    round(accuracy_score(y_test, baseline_predictions), 4)
)
print(
    "Selected-feature accuracy:",
    round(accuracy_score(y_test, selected_predictions), 4)
)
print(
    "Baseline suspicious F1:",
    round(f1_score(
        y_test, baseline_predictions,
        pos_label="SUSPICIOUS",
        zero_division=0
    ), 4)
)
print(
    "Selected-feature suspicious F1:",
    round(f1_score(
        y_test, selected_predictions,
        pos_label="SUSPICIOUS",
        zero_division=0
    ), 4)
)

# 9. Save the selected model and feature list
joblib.dump(
    {
        "model": selected_model,
        "features": selected_features,
    },
    "quantum_inspired_model.pkl"
)

print("\nSaved: quantum_inspired_model.pkl")

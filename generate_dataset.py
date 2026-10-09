
import csv
import random
from pathlib import Path

# Keep the generated data reproducible
random.seed(42)

# Create a folder for our dataset
data_folder = Path("dataset")
data_folder.mkdir(exist_ok=True)

# Dataset file path
file_path = data_folder / "security_events.csv"

# Columns in our dataset
columns = [
    "failed_attempts",
    "requests_per_minute",
    "unknown_device",
    "revoked_key_used",
    "invalid_signature",
    "label",
]

# Generate 1000 simulated security events
with file_path.open("w", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=columns)
    writer.writeheader()

    for _ in range(1000):
        failed = random.randint(0, 6)
        requests = random.randint(1, 30)
        unknown_device = random.randint(0, 1)
        revoked_key = random.randint(0, 1)
        invalid_signature = random.randint(0, 1)

        # Simple rules to label suspicious events
        suspicious = (
            revoked_key == 1
            or failed >= 3
            or requests >= 20
            or (
                unknown_device == 1
                and invalid_signature == 1
                and failed >= 1
            )
        )

        label = "SUSPICIOUS" if suspicious else "NORMAL"

        writer.writerow({
            "failed_attempts": failed,
            "requests_per_minute": requests,
            "unknown_device": unknown_device,
            "revoked_key_used": revoked_key,
            "invalid_signature": invalid_signature,
            "label": label,
        })

print("Dataset created successfully!")
print("Total records: 1000")
print("File location:", file_path.resolve())

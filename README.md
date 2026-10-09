# QuantumShield SOC | Quantum-Inspired Cyber Threat Intelligence

**An AI-powered cyber threat detection prototype for digital signature security.**

QuantumShield analyzes security-event features using machine learning and a simplified quantum-inspired probabilistic feature-selection approach to classify activity as normal or suspicious.

## Features

- **Threat Analyzer:** Analyze security events and display model predictions.
- **Digital Signature Sandbox:** Demonstrate document signing and signature verification.
- **Security Dashboard:** View threat summaries, activity charts, and event history.
- **Machine Learning:** Random Forest classification.
- **Quantum-Inspired Feature Selection:** Explore feature combinations using a probability-based optimization heuristic.
- **Event Dataset:** Synthetic security-event data for development and demonstration.

## Technology Stack

- Python
- scikit-learn
- Pandas
- React and TypeScript
- Vite
- Tailwind CSS
- FastAPI (backend API)

## Project Structure

- `app.py` — Python dashboard entry point
- `backend/` — Backend API
- `frontend/` — React dashboard
- `dataset/` — Synthetic security-event dataset
- `generate_dataset.py` — Dataset generation
- `train_model.py` — Random Forest training
- `quantum_inspired.py` — Quantum-inspired feature-selection experiment
- `quantum_predict.py` — Prediction using the saved model
- `signature_demo.py` — Digital signature demonstration

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vikasbalaji1717/quantum-signature-security.git
cd quantum-signature-security
```

### 2. Create a Python environment

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install Python dependencies

Install the packages required by the Python backend and model. If a `requirements.txt` file is provided, run:

```bash
pip install -r requirements.txt
```

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Use the local URL printed by Vite in the terminal.

**Note:** Start the Python backend separately using its documented run command. The exact command depends on the backend entry point and configuration.

## Testing

The project supports testing with synthetic security events. Test normal and suspicious examples and verify that the dashboard displays the model's predictions.

## Limitations

- The included dataset is synthetic and does not establish real-world detection accuracy.
- The quantum-inspired feature-selection approach is a classical probability-based heuristic; it does not run on quantum hardware or demonstrate quantum advantage.
- Live network monitoring requires integration with real traffic or security-log sources.
- Model confidence and dashboard risk indicators should not be interpreted as calibrated probabilities unless separately validated.

## Future Improvements

- Integrate real network telemetry.
- Add automated model evaluation and testing.
- Improve authentication, audit logging, and deployment security.
- Evaluate performance on representative, independently labeled security data.

## Disclaimer

This project is an educational cybersecurity prototype. Predictions are decision-support signals and should be verified before taking security action.

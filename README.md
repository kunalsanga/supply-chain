# Supply Chain Management System

A full-stack project for real-time retail inventory management, demand prediction, and analytics. Features a Spring Boot backend (with H2 in-memory DB, KaggleHub integration for real datasets) and a React + Tailwind CSS frontend dashboard.

---

## 📁 Folder Structure

```
project-root/
├── backend/      # Spring Boot backend, Python scripts, Maven, Kaggle integration
├── frontend/     # React + Tailwind CSS frontend dashboard
├── run-project.bat  # Batch file to run both backend and frontend
├── run-with-ai.bat  # Batch file to run backend, frontend, and AI service
├── sample_inventory.csv  # Example inventory data
└── README.md
```

---

## 🚀 Quickstart

### 1. Prerequisites
- **Java 17+** (for backend)
- **Python 3.8+** (for KaggleHub integration and AI service)
- **Node.js 14+** (for frontend)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/kunalsanga/supply-chain.git
cd supply-chain
```

### 3. Backend Setup
- Open a terminal in the `backend` directory (or use the batch file)
- Install Python dependencies:
  ```bash
  cd backend
  pip install -r requirements.txt
  ```
- Start the backend server:
  ```bash
  .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
  ```
  The backend runs on [http://localhost:8080](http://localhost:8080)

### 4. AI Service Setup (Optional)
- The AI service provides ML predictions for inventory status
- Start the Python AI service:
  ```bash
  cd backend
  python ai_service.py
  ```
  The AI service runs on [http://localhost:8000](http://localhost:8000)

### 5. Frontend Setup
- Open a new terminal in the `frontend` directory
- Install dependencies:
  ```bash
  cd frontend
  npm install
  ```
- Start the frontend:
  ```bash
  npm start
  ```
  The dashboard runs on [http://localhost:3000](http://localhost:3000)

### 6. Quick Start with AI (Recommended)
- Use the provided batch file to start all services:
  ```bash
  run-with-ai.bat
  ```

---

## 🤖 AI Prediction Features

### Inventory Status Prediction
- **Endpoint**: `GET /api/predict-inventory-status`
- **Description**: Analyzes inventory data and predicts stock status
- **Predictions**:
  - **Stock Status**: UNDERSTOCKED, OVERSTOCKED, or NORMAL
  - **Demand Forecast**: Expected demand increase/decrease
  - **Recommendations**: Actionable insights for inventory management

### AI Service Architecture
- **Spring Boot Backend**: Fetches inventory data from database
- **Python FastAPI Service**: Processes data and generates ML predictions
- **REST API Communication**: Backend calls AI service via HTTP

### Example AI Prediction Response
```json
{
  "productId": "P001",
  "productName": "Product A",
  "storeId": "STORE001",
  "category": "Electronics",
  "currentInventory": 50,
  "stockStatus": "UNDERSTOCKED",
  "expectedDemandIncrease": true,
  "demandForecast": 100.0,
  "recommendation": "Increase inventory levels immediately"
}
```

---

## 📦 KaggleHub Integration (Real Retail Data)

- The backend can download real inventory datasets from Kaggle using KaggleHub (Python).
- **To trigger download:**
  - Use the dashboard's "Download Kaggle Dataset" button, or
  - Call the API: `POST http://localhost:8080/api/inventory/download-kaggle`
- The Python script will fetch and convert the data. You can also manually upload a CSV via the dashboard.
- See `KAGGLE_INTEGRATION.md` for advanced usage and troubleshooting.

---

## 📝 Manual CSV Upload
- You can upload your own inventory CSV file using the dashboard's upload feature.
- Example file: `sample_inventory.csv`

---

## 🛠️ Troubleshooting
- **Backend fails to start:** Ensure you use the provided Maven command and have Java installed.
- **Python/KaggleHub errors:** Make sure Python and dependencies are installed (`pip install -r requirements.txt` in backend).
- **AI service not responding:** Check if the Python AI service is running on port 8000.
- **Frontend issues:** Ensure Node.js is installed, and run `npm install` before `npm start`.
- **No inventory data:** Download from Kaggle or upload a CSV file via the dashboard.

---

## 📚 More Info
- See `KAGGLE_INTEGRATION.md` for detailed KaggleHub usage.
- Backend and frontend each have their own README for advanced configuration.

---

## ✨ Features
- Real-time inventory dashboard
- AI-powered demand prediction and stock status analysis
- Kaggle dataset integration
- Manual CSV upload
- Modern UI with Tailwind CSS
- Easy local setup (no external DB required)
- Machine learning predictions via Python FastAPI service 
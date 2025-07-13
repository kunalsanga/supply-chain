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

## 🚀 Quick Start

### Prerequisites Check
Make sure you have:
- ✅ **Java 17+** installed
- ✅ **Python 3.8+** installed  
- ✅ **Node.js 14+** installed
- ✅ **Git** installed

### Option 1: Quick Start with Batch File (Recommended)
```bash
# Clone the repository
git clone https://github.com/kunalsanga/supply-chain.git
cd supply-chain

# Run all services with one command
.\run-with-ai.bat
```

This will automatically start:
- Python AI Service on http://localhost:8000
- Spring Boot Backend on http://localhost:8080
- React Frontend on http://localhost:3000

### Option 2: Manual Setup

#### Step 1: Install Dependencies
```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt

# Install Frontend dependencies
cd ../frontend
npm install
```

#### Step 2: Start Services (3 Terminal Windows)

**Terminal 1 - Python AI Service:**
```bash
cd backend
python ai_service.py
```
*This starts the AI service on http://localhost:8000*

**Terminal 2 - Spring Boot Backend:**
```bash
cd backend
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
*This starts the backend on http://localhost:8080*

**Terminal 3 - React Frontend:**
```bash
cd frontend
npm start
```
*This starts the frontend on http://localhost:3000*

---

## 📊 Load and View Data

Once all services are running:

1. **Open your browser** and go to: http://localhost:3000

2. **Download Kaggle Data:**
   - Click "Download Kaggle Dataset" button
   - Wait for download to complete

3. **Load Data into Database:**
   - Click "Load Kaggle Data" button
   - This will populate the database with inventory data

4. **View Inventory Data:**
   - The dashboard will now show real inventory data
   - You can search, filter, and view inventory events

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

### Testing AI Predictions

**Option A: Via Frontend**
- Select inventory items
- Click "Run Forecast" to get AI predictions

**Option B: Via API**
```bash
curl http://localhost:8080/api/predict-inventory-status
```

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

### Common Issues:

1. **Backend fails to start:**
   - Ensure you use the provided Maven command: `.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run`
   - Make sure Java 17+ is installed
   - Check if port 8080 is available

2. **Python/KaggleHub errors:**
   - Make sure Python and dependencies are installed: `pip install -r requirements.txt` in backend
   - Verify Python 3.8+ is installed
   - Check if kagglehub is installed: `pip install kagglehub`

3. **AI service not responding:**
   - Check if the Python AI service is running on port 8000
   - Verify FastAPI dependencies are installed
   - Check console for error messages

4. **Frontend issues:**
   - Ensure Node.js 14+ is installed
   - Run `npm install` before `npm start`
   - Check if port 3000 is available

5. **No inventory data:**
   - Download from Kaggle first using the dashboard button
   - Then click "Load Kaggle Data" to populate database
   - Or upload a CSV file via the dashboard

6. **Batch file not working:**
   - Run commands manually in separate terminals
   - Check if all prerequisites are installed
   - Verify file paths are correct

### Error Messages:

- **"Python script failed"**: Check if Python and dependencies are installed
- **"Download failed"**: Check internet connection and Kaggle dataset availability
- **"File not found"**: Ensure the Python script is in the correct location
- **"Port already in use"**: Stop other services using the same ports

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
- Complete supply chain management solution

---

## 🔗 Service URLs
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8080  
- **AI Service**: http://localhost:8000
- **AI Predictions**: http://localhost:8080/api/predict-inventory-status
- **H2 Database Console**: http://localhost:8080/h2-console

---

## 📋 API Endpoints

### Inventory Management
- `GET /api/inventory/events` - Get all inventory events
- `POST /api/inventory/upload` - Upload CSV file
- `POST /api/inventory/download-kaggle` - Download Kaggle dataset
- `POST /api/inventory/load-kaggle-data` - Load Kaggle data into database

### AI Predictions
- `GET /api/predict-inventory-status` - Get AI predictions for inventory status

### System Status
- `GET /api/inventory/kaggle-status` - Check Kaggle data availability 
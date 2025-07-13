# 🚀 SupplyChain AI - Advanced Inventory Management System

> **Hackathon Project**: A cutting-edge supply chain management platform powered by AI and real-time analytics

![SupplyChain AI](https://img.shields.io/badge/SupplyChain-AI-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0+-green?style=for-the-badge&logo=spring)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=for-the-badge&logo=fastapi)

## 🎯 Project Overview

SupplyChain AI is a comprehensive inventory management system that combines modern web technologies with advanced AI capabilities to provide real-time insights, predictive analytics, and intelligent recommendations for supply chain optimization.

### ✨ Key Features

- **🤖 AI-Powered Predictions**: Advanced machine learning algorithms for demand forecasting and inventory optimization
- **📊 Real-time Analytics**: Live dashboard with interactive charts and visualizations
- **🔔 Smart Alerts**: Intelligent stock alerts and recommendations
- **📈 Revenue Forecasting**: Predictive analytics for revenue optimization
- **🌐 Multi-Service Architecture**: Scalable microservices architecture
- **📱 Modern UI/UX**: Beautiful, responsive interface with professional design
- **⚡ Real-time Updates**: Live data synchronization and monitoring
- **📊 Advanced Visualizations**: Interactive charts and data visualization

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Spring Boot    │    │   Python AI     │
│   (TypeScript)   │◄──►│   Backend API   │◄──►│   Service       │
│   Port: 3000     │    │   Port: 8080    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Java 17+** and Maven
- **Python 3.8+** and pip
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd supplychain-ai
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

3. **Install Python AI Service Dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Backend Dependencies** (Maven will download automatically)

## 🏃‍♂️ Running the Application

### Option 1: Manual Setup (Recommended for Development)

**Open 3 separate terminal windows/tabs and run each command:**

#### 1️⃣ Start the AI Service (Python FastAPI)
```bash
cd backend
python ai_service.py
```
*This starts the AI service on http://localhost:8000*

#### 2️⃣ Start the Spring Boot Backend
```bash
cd backend
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
*This starts the backend API on http://localhost:8080*

#### 3️⃣ Start the React Frontend
```bash
cd frontend
npm start
```
*This starts the frontend on http://localhost:3000*

### Option 2: Using Batch Files (Windows)

If you have batch files set up:
```bash
# Run all services with one command
.\run-with-ai.bat
```

## 🌐 Access Your Application

Once all services are running, open your browser and navigate to:
**http://localhost:3000**

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Port 8000 Already in Use (AI Service)
```bash
# Find the process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with the actual process ID)
taskkill /PID <PID> /F

# Then start the AI service again
cd backend
python ai_service.py
```

#### 2. Frontend Dependencies Issues
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

#### 3. Backend Compilation Errors
```bash
cd backend
# Clean and rebuild
.\apache-maven-3.9.6\bin\mvn.cmd clean
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

#### 4. Python Dependencies Missing
```bash
cd backend
pip install fastapi uvicorn numpy pandas
```

#### 5. Java Version Issues
Make sure you have Java 17+ installed:
```bash
java -version
```

### Service Status Check

| Service | URL | Status Check |
|---------|-----|--------------|
| Frontend | http://localhost:3000 | Should show the dashboard |
| Backend API | http://localhost:8080 | Should return API responses |
| AI Service | http://localhost:8000 | Should show health status |

### Testing Individual Services

#### Test AI Service
```bash
curl http://localhost:8000/health
```

#### Test Backend API
```bash
curl http://localhost:8080/api/inventory/events
```

#### Test Frontend
Open http://localhost:3000 in your browser

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

## 📦 KaggleHub Integration (Real Retail Data)

- The backend can download real inventory datasets from Kaggle using KaggleHub (Python).
- **To trigger download:**
  - Use the dashboard's "Download Kaggle Dataset" button, or
  - Call the API: `POST http://localhost:8080/api/inventory/download-kaggle`
- The Python script will fetch and convert the data. You can also manually upload a CSV via the dashboard.
- See `KAGGLE_INTEGRATION.md` for advanced usage and troubleshooting.

## 📝 Manual CSV Upload
- You can upload your own inventory CSV file using the dashboard's upload feature.
- Example file: `sample_inventory.csv`

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0**: Latest React with modern features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Beautiful and responsive charts
- **Framer Motion**: Smooth animations and transitions
- **React Hot Toast**: Elegant notifications
- **Lucide React**: Modern icon library

### Backend
- **Spring Boot 3.0+**: Enterprise-grade Java framework
- **Spring Data JPA**: Database abstraction layer
- **H2 Database**: In-memory database for development
- **Maven**: Dependency management and build tool
- **RESTful APIs**: Clean and scalable API design

### AI Service
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation and serialization
- **NumPy**: Numerical computing
- **Uvicorn**: ASGI server for FastAPI

## 📊 Data Sources

### Kaggle Integration
- **Real Retail Data**: Integration with Kaggle datasets
- **Automated Download**: One-click dataset download
- **Data Processing**: Automated data cleaning and processing
- **CSV Import**: Support for custom CSV file uploads

### Sample Data
- **Inventory Events**: Comprehensive inventory tracking
- **Product Information**: Detailed product metadata
- **Store Data**: Multi-store inventory management
- **Analytics Data**: Rich analytics dataset

## 🎯 Hackathon Highlights

### 🏆 Advanced Features
1. **AI-Powered Analytics**: Machine learning for demand forecasting
2. **Real-time Dashboard**: Live updates and monitoring
3. **Professional UI/UX**: Modern, responsive design
4. **Multi-service Architecture**: Scalable microservices
5. **Advanced Visualizations**: Interactive charts and graphs
6. **Smart Alerts**: Intelligent notification system
7. **Revenue Optimization**: Predictive revenue analytics
8. **Performance Monitoring**: Real-time system health

### 🚀 Technical Excellence
- **Modern Tech Stack**: Latest versions of all technologies
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first approach
- **Performance Optimized**: Fast loading and smooth interactions
- **Scalable Architecture**: Microservices design
- **Real-time Capabilities**: WebSocket-like real-time updates
- **Professional Code**: Clean, well-documented codebase

### 📈 Business Value
- **Cost Optimization**: AI-powered inventory optimization
- **Revenue Growth**: Predictive analytics insights
- **Risk Mitigation**: Intelligent alert system
- **Operational Efficiency**: Automated monitoring
- **Data-Driven Decisions**: Comprehensive analytics

## 🔧 Configuration

### Environment Variables
```bash
# Backend Configuration
SPRING_PROFILES_ACTIVE=dev
AI_SERVICE_URL=http://localhost:8000

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8080
REACT_APP_AI_SERVICE_URL=http://localhost:8000
```

### Database Configuration
The application uses H2 in-memory database by default. For production, configure your preferred database in `application.properties`.

## 📝 API Documentation

### Backend APIs
- `GET /api/inventory/events` - Get all inventory events
- `GET /api/predict-inventory-status` - Get AI predictions
- `GET /api/analytics/dashboard-stats` - Get dashboard statistics
- `GET /api/analytics/revenue-forecast` - Get revenue forecasting
- `GET /api/analytics/stock-alerts` - Get stock alerts
- `POST /api/inventory/upload` - Upload CSV data
- `POST /api/inventory/download-kaggle` - Download Kaggle dataset

### AI Service APIs
- `POST /predict` - Generate AI predictions
- `POST /optimize` - Optimize inventory levels
- `GET /analytics/revenue-forecast` - Revenue forecasting
- `GET /analytics/stock-alerts` - Stock alerts
- `GET /health` - Service health check

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
mvn test
```

### AI Service Testing
```bash
cd backend
python -m pytest test_ai_service.py
```

## 📦 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Build the frontend: `npm run build`
2. Build the backend: `mvn clean package`
3. Deploy to your preferred hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Kaggle**: For providing real retail datasets
- **React Team**: For the amazing React framework
- **Spring Team**: For the robust Spring Boot framework
- **FastAPI Team**: For the modern Python web framework
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Hackathon**

*This project demonstrates advanced web development, AI integration, and modern software architecture principles.* 
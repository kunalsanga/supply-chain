@echo off
echo Starting Supply Chain Management System with AI...

echo.
echo Starting Python AI Service...
start "AI Service" cmd /k "cd backend && python ai_service.py"

echo.
echo Waiting for AI service to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Spring Boot Backend...
start "Backend" cmd /k "cd backend && .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"

echo.
echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo.
echo Starting React Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo All services are starting...
echo.
echo AI Service: http://localhost:8000
echo Backend API: http://localhost:8080
echo Frontend Dashboard: http://localhost:3000
echo.
echo AI Prediction Endpoint: http://localhost:8080/api/predict-inventory-status
echo.
pause 
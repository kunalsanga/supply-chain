@echo off
echo Starting Supply Chain Management System...
echo.

echo Step 1: Installing Python dependencies...
cd backend
pip install -r requirements.txt
echo.

echo Step 2: Starting Backend (Spring Boot)...
start "Backend" cmd /k "cd /d %cd% && .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"
echo Backend starting on http://localhost:8080
echo.

echo Step 3: Starting Frontend (React)...
cd ..\frontend
start "Frontend" cmd /k "cd /d %cd% && npm start"
echo Frontend starting on http://localhost:3000
echo.

echo Project is starting up...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Wait a few minutes for both services to fully start.
echo Then open http://localhost:3000 in your browser.
pause 
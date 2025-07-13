@echo off
echo Starting PostgreSQL for Supply Chain Management System
echo ===================================================

echo.
echo Checking if Docker is installed...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo Docker is installed. Starting PostgreSQL...
echo.

echo Starting PostgreSQL container...
docker-compose up -d postgres

echo.
echo Waiting for PostgreSQL to start...
timeout /t 5 /nobreak >nul

echo.
echo Checking if PostgreSQL is running...
docker ps | findstr postgres-supplychain
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL failed to start!
    echo Check Docker logs: docker logs postgres-supplychain
    pause
    exit /b 1
)

echo.
echo ✅ PostgreSQL is running successfully!
echo.
echo Database Details:
echo - Host: localhost
echo - Port: 5432
echo - Database: supplychain_db
echo - Username: postgres
echo - Password: password
echo.

echo Optional: Access pgAdmin at http://localhost:8081
echo Login: admin@supplychain.com / admin123
echo.

echo You can now start the backend application:
echo cd backend
echo .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
echo.

pause 
@echo off
echo Setting up PostgreSQL for Supply Chain Management System
echo ======================================================

echo.
echo 1. Installing PostgreSQL...
echo Please download PostgreSQL from: https://www.postgresql.org/download/windows/
echo Or use Chocolatey: choco install postgresql
echo.

echo 2. After installation, create the database:
echo psql -U postgres
echo CREATE DATABASE supplychain_db;
echo \q
echo.

echo 3. Alternative: Use Docker for PostgreSQL
echo docker run --name postgres-supplychain -e POSTGRES_PASSWORD=password -e POSTGRES_DB=supplychain_db -p 5432:5432 -d postgres:15
echo.

echo 4. Database Configuration:
echo - Host: localhost
echo - Port: 5432
echo - Database: supplychain_db
echo - Username: postgres
echo - Password: password
echo.

echo 5. Start the backend after PostgreSQL is running:
echo cd backend
echo .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
echo.

pause 
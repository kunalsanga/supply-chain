@echo off
echo Setting up PostgreSQL Database for Supply Chain Management
echo ========================================================

echo.
echo This script will help you create the database and test the connection.
echo.

echo Step 1: Creating the database...
echo Please enter your PostgreSQL password when prompted.
echo.

REM Try to create the database
psql -U postgres -c "CREATE DATABASE supplychain_db;" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Database 'supplychain_db' created successfully!
) else (
    echo ⚠️  Database might already exist or there was an issue.
    echo This is usually okay if the database already exists.
)

echo.
echo Step 2: Testing database connection...
echo.

REM Test the connection
psql -U postgres -d supplychain_db -c "SELECT version();" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Database connection successful!
    echo.
    echo Step 3: Database is ready for the application!
    echo.
    echo You can now start the backend:
    echo cd backend
    echo .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
    echo.
) else (
    echo ❌ Database connection failed!
    echo.
    echo Troubleshooting:
    echo 1. Make sure PostgreSQL is running
    echo 2. Check if the password is correct
    echo 3. Verify PostgreSQL is on port 5432
    echo.
    echo To start PostgreSQL service manually:
    echo net start postgresql-x64-17
    echo.
)

echo.
echo Database Configuration:
echo - Host: localhost
echo - Port: 5432
echo - Database: supplychain_db
echo - Username: postgres
echo - Password: [your PostgreSQL password]
echo.

pause 
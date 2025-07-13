# PostgreSQL Setup for Supply Chain Management System

## Why PostgreSQL?

PostgreSQL is the best choice for this supply chain management system because:

1. **ACID Compliance** - Ensures data integrity for inventory transactions
2. **Complex Queries** - Better for analytics and reporting
3. **Relational Data** - Perfect for inventory, products, stores relationships
4. **Performance** - Optimized for large datasets with proper indexing
5. **Mature Ecosystem** - Better tools and community support

## Setup Options

### Option 1: Docker (Recommended)

1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop/

2. **Start PostgreSQL with Docker Compose:**
   ```bash
   docker-compose up -d postgres
   ```

3. **Verify PostgreSQL is running:**
   ```bash
   docker ps
   ```

4. **Access pgAdmin (optional):**
   - Open http://localhost:8081
   - Login: admin@supplychain.com / admin123
   - Add server: localhost:5432, postgres/password

### Option 2: Local PostgreSQL Installation

1. **Download PostgreSQL** from https://www.postgresql.org/download/windows/

2. **Install with default settings** (remember the password you set)

3. **Create the database:**
   ```bash
   psql -U postgres
   CREATE DATABASE supplychain_db;
   \q
   ```

### Option 3: Chocolatey (Windows)

1. **Install Chocolatey** if not already installed

2. **Install PostgreSQL:**
   ```bash
   choco install postgresql
   ```

3. **Create database:**
   ```bash
   createdb -U postgres supplychain_db
   ```

## Database Configuration

The application is configured to connect to:
- **Host:** localhost
- **Port:** 5432
- **Database:** supplychain_db
- **Username:** postgres
- **Password:** password

## Performance Optimizations

### Database Indexes
PostgreSQL will automatically create indexes for:
- Primary keys
- Foreign keys
- Unique constraints

### Connection Pooling
Configured with HikariCP:
- Maximum pool size: 20
- Minimum idle: 5
- Connection timeout: 30 seconds

### Batch Processing
- Batch size: 50 records
- Optimized for bulk inserts

## Starting the Application

1. **Ensure PostgreSQL is running**

2. **Start the backend:**
   ```bash
   cd backend
   .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
   ```

3. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. **Start the AI service:**
   ```bash
   cd backend
   python ai_service.py
   ```

## Troubleshooting

### Connection Issues
- Check if PostgreSQL is running: `docker ps` or `pg_ctl status`
- Verify port 5432 is not blocked
- Check firewall settings

### Performance Issues
- Monitor database size: `SELECT pg_size_pretty(pg_database_size('supplychain_db'));`
- Check slow queries: Enable `log_statement = 'all'` in postgresql.conf
- Monitor connection pool usage

### Data Import Issues
- Large CSV files are processed in batches of 1000 records
- Timeout is set to 5 minutes
- Maximum 50,000 records per import

## Benefits of PostgreSQL

1. **Better Performance** - Handles large datasets efficiently
2. **Data Integrity** - ACID compliance prevents data corruption
3. **Complex Analytics** - Advanced SQL features for reporting
4. **Scalability** - Can handle millions of records
5. **Backup & Recovery** - Robust backup solutions
6. **Monitoring** - Built-in performance monitoring tools

## Migration from H2

The application will automatically:
1. Create tables on first startup
2. Migrate existing data (if any)
3. Optimize indexes for performance

## Next Steps

After setting up PostgreSQL:
1. Upload your CSV data
2. Test the analytics features
3. Monitor performance
4. Scale as needed 
# Database Configuration Guide

This guide explains how to configure different SQL databases for the AirTracker Airline Management System.

## Supported Databases

- **SQLite** (Default - for development)
- **MySQL** (Recommended for production)
- **SQL Server** (Enterprise option)
- **PostgreSQL** (Alternative production option)

## Quick Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your database configuration
3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run database setup:
   ```bash
   python setup_database.py
   ```

## Database-Specific Configuration

### SQLite (Default)
Perfect for development and testing. No additional setup required.

```env
DB_ENGINE=django.db.backends.sqlite3
```

### MySQL Configuration

1. **Install MySQL Server**
   - Download from https://dev.mysql.com/downloads/mysql/
   - Install and configure with a root password

2. **Create Database**
   ```sql
   CREATE DATABASE airline_tracker_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'airline_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON airline_tracker_db.* TO 'airline_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update .env file**
   ```env
   DB_ENGINE=django.db.backends.mysql
   DB_NAME=airline_tracker_db
   DB_USER=airline_user
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=3306
   ```

4. **Install MySQL Client**
   ```bash
   # On Windows
   pip install mysqlclient
   
   # Alternative (if mysqlclient fails)
   pip install PyMySQL
   ```

### SQL Server Configuration

1. **Install SQL Server**
   - Download SQL Server Express (free)
   - Install SQL Server Management Studio (SSMS)

2. **Install ODBC Driver**
   - Download "ODBC Driver 17 for SQL Server"

3. **Create Database**
   ```sql
   CREATE DATABASE airline_tracker_db;
   CREATE LOGIN airline_user WITH PASSWORD = 'YourPassword123!';
   USE airline_tracker_db;
   CREATE USER airline_user FOR LOGIN airline_user;
   ALTER ROLE db_owner ADD MEMBER airline_user;
   ```

4. **Update .env file**
   ```env
   DB_ENGINE=mssql
   DB_NAME=airline_tracker_db
   DB_USER=airline_user
   DB_PASSWORD=YourPassword123!
   DB_HOST=localhost
   DB_PORT=1433
   ```

5. **Install SQL Server Packages**
   ```bash
   pip install django-mssql-backend pyodbc
   ```

### PostgreSQL Configuration

1. **Install PostgreSQL**
   - Download from https://www.postgresql.org/download/

2. **Create Database**
   ```sql
   CREATE DATABASE airline_tracker_db;
   CREATE USER airline_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE airline_tracker_db TO airline_user;
   ```

3. **Update .env file**
   ```env
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=airline_tracker_db
   DB_USER=airline_user
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

4. **Install PostgreSQL Adapter**
   ```bash
   pip install psycopg2-binary
   ```

## Database Models

The application includes the following main models:

### CustomUser Model
```python
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    passport_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Future Models (to be added)
- Flight
- Airport
- Airline
- Booking
- Passenger
- Ticket

## Migration Commands

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Check migration status
python manage.py showmigrations

# Create superuser
python manage.py createsuperuser

# Reset database (if needed)
python manage.py flush
```

## Troubleshooting

### MySQL Issues
- **Error: "mysql_config not found"**
  ```bash
  # Install MySQL development headers
  sudo apt-get install libmysqlclient-dev  # Ubuntu
  brew install mysql                       # macOS
  ```

- **Error: "Authentication plugin 'caching_sha2_password'"**
  ```sql
  ALTER USER 'airline_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
  ```

### SQL Server Issues
- **Error: "ODBC Driver not found"**
  - Install "ODBC Driver 17 for SQL Server"
  - Ensure it's in system PATH

### General Database Issues
- **Error: "FATAL: database does not exist"**
  - Create the database manually using SQL commands above
  
- **Error: "Access denied for user"**
  - Check username/password in .env file
  - Verify user has proper permissions

## Performance Optimization

### Database Indexes
The models include appropriate indexes for performance:
- Email field (unique index)
- Created/updated timestamps
- Foreign key relationships

### Connection Pooling
For production, consider using connection pooling:

```python
# In settings.py for MySQL
DATABASES['default']['OPTIONS'].update({
    'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
    'charset': 'utf8mb4',
    'autocommit': True,
})
```

## Security Best Practices

1. **Use environment variables** for sensitive data
2. **Create dedicated database users** with minimal privileges
3. **Use SSL connections** in production
4. **Regular backups** of your database
5. **Keep database software updated**

## Database Backup Commands

### MySQL
```bash
mysqldump -u airline_user -p airline_tracker_db > backup.sql
mysql -u airline_user -p airline_tracker_db < backup.sql
```

### SQL Server
```sql
BACKUP DATABASE airline_tracker_db TO DISK = 'C:\backup\airline_tracker.bak'
RESTORE DATABASE airline_tracker_db FROM DISK = 'C:\backup\airline_tracker.bak'
```


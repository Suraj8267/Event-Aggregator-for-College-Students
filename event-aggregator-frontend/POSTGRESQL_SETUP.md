# 🐘 PostgreSQL Database Setup Guide

## 📋 What I Need From You

To connect your project to PostgreSQL, please provide the following information:

### **1. PostgreSQL Connection Details:**

```
Database Host: ___________________ (e.g., localhost or your server IP)
Database Port: ___________________ (default is 5432)
Database Name: ___________________ (e.g., event_aggregator_db)
Username: ________________________ (your PostgreSQL username)
Password: ________________________ (your PostgreSQL password)
```

### **2. PostgreSQL Installation Status:**

- [ ] PostgreSQL is already installed on my system
- [ ] I need to install PostgreSQL
- [ ] I'm using a cloud PostgreSQL service (e.g., AWS RDS, Heroku, etc.)

---

## 🚀 Quick Setup Options

### **Option 1: Local PostgreSQL (Recommended for Development)**

#### **Step 1: Install PostgreSQL**

**For Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the `postgres` user
4. Default port: 5432

**For Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**For Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### **Step 2: Create Database**

Open PostgreSQL command line (psql):
```sql
-- Login as postgres user
psql -U postgres

-- Create database
CREATE DATABASE event_aggregator_db;

-- Create user (optional, or use postgres user)
CREATE USER event_admin WITH PASSWORD 'your_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE event_aggregator_db TO event_admin;

-- Exit
\q
```

#### **Step 3: Provide These Details:**
```
Host: localhost
Port: 5432
Database: event_aggregator_db
Username: postgres (or event_admin)
Password: [your password]
```

---

### **Option 2: Cloud PostgreSQL (Heroku, AWS RDS, etc.)**

If you're using a cloud service, provide:
```
Connection String: postgresql://username:password@host:port/database
```

Or individual details:
```
Host: [provided by cloud service]
Port: [usually 5432]
Database: [your database name]
Username: [provided by cloud service]
Password: [provided by cloud service]
```

---

## 📝 What Will Be Updated

Once you provide the details, I will update:

### **1. Backend Configuration (`main.py`):**
```python
# Current (SQLite):
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'

# Will change to (PostgreSQL):
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@host:port/database'
```

### **2. Requirements File:**
Add PostgreSQL driver:
```
psycopg2-binary==2.9.9
```

### **3. Environment Variables (`.env` file):**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_aggregator_db
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## 🔧 Installation Commands

After you provide the details, run:

```bash
# Install PostgreSQL driver
pip install psycopg2-binary

# Or if that fails, try:
pip install psycopg2

# Initialize database
python init_db.py
```

---

## ✅ Benefits of PostgreSQL

- ✅ **Better Performance** - Handles more concurrent users
- ✅ **Data Integrity** - ACID compliance
- ✅ **Scalability** - Grows with your application
- ✅ **Advanced Features** - Full-text search, JSON support
- ✅ **Production Ready** - Used by major companies

---

## 🐛 Common Issues & Solutions

### **Issue 1: "psycopg2" installation fails**
**Solution:**
```bash
# Windows
pip install psycopg2-binary

# Mac/Linux
brew install postgresql  # or apt-get install postgresql
pip install psycopg2-binary
```

### **Issue 2: "Connection refused"**
**Solution:**
- Check if PostgreSQL is running
- Verify host and port
- Check firewall settings

### **Issue 3: "Authentication failed"**
**Solution:**
- Verify username and password
- Check `pg_hba.conf` file for authentication method

---

## 📊 Database Migration

### **Migrate from SQLite to PostgreSQL:**

```bash
# Export SQLite data
sqlite3 events.db .dump > backup.sql

# Import to PostgreSQL (after setup)
psql -U postgres -d event_aggregator_db < backup.sql
```

---

## 🔐 Security Best Practices

1. **Never commit passwords to Git**
   - Use `.env` file
   - Add `.env` to `.gitignore`

2. **Use strong passwords**
   - Mix of letters, numbers, symbols
   - At least 12 characters

3. **Limit database user permissions**
   - Create separate user for application
   - Grant only necessary privileges

---

## 📞 Next Steps

**Please provide:**

1. ✅ PostgreSQL connection details (host, port, database, username, password)
2. ✅ Confirm PostgreSQL is installed and running
3. ✅ Let me know if you need help with installation

**Once you provide these, I will:**

1. ✅ Update `main.py` with PostgreSQL connection
2. ✅ Create `.env` file for secure configuration
3. ✅ Update `requirements.txt`
4. ✅ Create database initialization script
5. ✅ Test the connection
6. ✅ Migrate existing data (if needed)

---

## 💡 Quick Start Template

**If you're using local PostgreSQL with default settings:**

```
Host: localhost
Port: 5432
Database: event_aggregator_db
Username: postgres
Password: [your postgres password]
```

**Just tell me your PostgreSQL password, and I'll set everything up!**

---

## 📧 What to Send Me

Simply reply with:

```
PostgreSQL Details:
- Host: localhost (or your host)
- Port: 5432 (or your port)
- Database: event_aggregator_db (or your preferred name)
- Username: postgres (or your username)
- Password: [your password]
```

**Or if you're using a connection string:**
```
Connection String: postgresql://username:password@host:port/database
```

---

## ⚠️ Important Notes

- Your password will be stored in a `.env` file (not committed to Git)
- Make sure PostgreSQL service is running before starting the app
- The database will be created automatically if it doesn't exist
- All existing SQLite data can be migrated

**Ready to switch to PostgreSQL! Just provide the connection details!** 🚀

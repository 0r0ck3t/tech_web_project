# Quick Start Guide

Get the Disney Characters application running in minutes!

## Prerequisites Check

- [ ] Java 17 or higher installed (`java -version`)
- [ ] Node.js 18+ installed (`node -v`)
- [ ] MySQL 8.0+ installed and running
- [ ] Maven 3.6+ installed (`mvn -v`)

## 5-Minute Setup

### Step 1: Database (2 minutes)

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE disney_db;"

# Import data (this may take a while due to large file)
mysql -u root -p disney_db < test.sql
```

### Step 2: Backend (1 minute)

```bash
cd backend

# Update application.properties with your MySQL password
# Edit: src/main/resources/application.properties
# Change: spring.datasource.password=YOUR_PASSWORD

# Start backend
mvn spring-boot:run
```

Backend will start at: `http://localhost:8080`

### Step 3: Frontend (2 minutes)

Open a new terminal:

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start frontend
npm start
```

Frontend will start at: `http://localhost:4200`

## First Use

1. Open browser to `http://localhost:4200`
2. Click **"Sign Up"**
3. Create an account:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
4. Click **"Log In"**
5. Browse Disney characters!

## Create Admin User

To access admin features:

```sql
mysql -u root -p disney_db

UPDATE users SET role = 'ADMIN' WHERE username = 'testuser';
```

Then log out and log in again. You'll see the admin interface with edit/delete buttons.

## Verify Everything Works

### Check Backend
```bash
# Should return "Whitelabel Error Page" (means it's running)
curl http://localhost:8080

# Test health
curl http://localhost:8080/actuator/health
```

### Check Frontend
Open `http://localhost:4200` in your browser. You should see the welcome page.

### Check Database
```sql
mysql -u root -p disney_db -e "SELECT COUNT(*) FROM data;"
```

Should return a large number (all Disney characters).

## Common Commands

### Backend

```bash
# Start backend
cd backend
mvn spring-boot:run

# Build
mvn clean install

# Run tests
mvn test
```

### Frontend

```bash
# Start development server
cd frontend
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database

```bash
# Connect to database
mysql -u root -p disney_db

# Check tables
mysql -u root -p disney_db -e "SHOW TABLES;"

# View users
mysql -u root -p disney_db -e "SELECT id, username, email, role FROM users;"
```

## Troubleshooting

### Port Already in Use

**Backend (8080):**
```bash
# Find process
lsof -i :8080

# Kill process
kill -9 <PID>
```

**Frontend (4200):**
```bash
# Find process
lsof -i :4200

# Kill process
kill -9 <PID>
```

### MySQL Connection Error

1. Check MySQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status mysql
   ```

2. Verify credentials in `backend/src/main/resources/application.properties`

3. Test connection:
   ```bash
   mysql -u root -p -e "SELECT 1;"
   ```

### Frontend Can't Connect to Backend

1. Check backend is running on port 8080
2. Check browser console for CORS errors
3. Verify backend CORS configuration allows `http://localhost:4200`

### Login Doesn't Work

1. Clear browser localStorage:
   ```javascript
   // In browser console
   localStorage.clear();
   ```

2. Check backend logs for authentication errors

3. Verify user exists in database:
   ```sql
   SELECT * FROM users WHERE username = 'your_username';
   ```

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [DATABASE_SETUP.md](DATABASE_SETUP.md) for advanced database configuration
- Explore the code structure
- Try editing a character (as admin)
- Customize the UI in `frontend/src/styles.css`

## Development Tips

1. **Hot Reload**: Both backend and frontend support hot reload during development

2. **Debug Backend**: Run with debug flag:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
   ```

3. **Debug Frontend**: Use browser DevTools (F12)

4. **View API Requests**: Check browser Network tab

5. **Database Changes**: Run migrations or update `spring.jpa.hibernate.ddl-auto` setting

## Getting Help

If you encounter issues:

1. Check the logs (backend terminal and browser console)
2. Verify all prerequisites are installed correctly
3. Review the README.md for detailed setup
4. Check DATABASE_SETUP.md for database issues

Enjoy exploring Disney characters! 🏰✨


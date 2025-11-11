# Database Setup Instructions

## MySQL Database Configuration

### 1. Create Database

```sql
CREATE DATABASE disney_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Create User (Optional)

If you want to create a dedicated user for the application:

```sql
CREATE USER 'disney_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON disney_db.* TO 'disney_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Import Character Data

The `test.sql` file contains the Disney characters data. Import it:

```bash
mysql -u root -p disney_db < test.sql
```

Or from MySQL command line:

```sql
USE disney_db;
SOURCE /path/to/proiect_java/test.sql;
```

### 4. Verify Data Import

Check if the data table was created and populated:

```sql
USE disney_db;
SHOW TABLES;
SELECT COUNT(*) FROM data;
SELECT id, JSON_EXTRACT(data, '$.name') as name FROM data LIMIT 10;
```

### 5. User Table

The `users` table will be automatically created by Spring Boot on first run. The schema is:

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('USER', 'ADMIN', 'EMPLOYEE') NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);
```

### 6. Create First Admin User

After registering a user through the application, you can promote them to admin:

```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';
```

Or create an admin directly (password is BCrypt hash of "admin123"):

```sql
INSERT INTO users (username, password, email, role, enabled) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye/Ci7nU0PX1azXTXrg.kFk9D4dFo0NQy', 'admin@example.com', 'ADMIN', true);
```

## Database Schema

### Table: `data`
Stores Disney character information in JSON format.

| Column | Type | Description |
|--------|------|-------------|
| id | INT UNSIGNED | Primary key, auto-increment |
| data | JSON | Character information (name, films, shows, etc.) |

### Table: `users`
Stores user authentication and authorization information.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key, auto-increment |
| username | VARCHAR(255) | Unique username |
| password | VARCHAR(255) | BCrypt hashed password |
| email | VARCHAR(255) | Unique email address |
| role | ENUM | USER, ADMIN, or EMPLOYEE |
| enabled | BOOLEAN | Account status |

## JSON Data Structure

Each character in the `data` table has the following JSON structure:

```json
{
  "name": "Character Name",
  "url": "https://api.disneyapi.dev/characters/123",
  "image": "data:image/png;base64,...",
  "films": ["Film 1", "Film 2"],
  "shortFilms": ["Short Film 1"],
  "tvShows": ["TV Show 1", "TV Show 2"],
  "videoGames": ["Game 1"],
  "parkAttractions": ["Attraction 1"],
  "allies": ["Ally 1", "Ally 2"],
  "enemies": ["Enemy 1"]
}
```

## Configuration

Update `backend/src/main/resources/application.properties` with your database credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/disney_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

## Troubleshooting

### Connection Issues

1. **MySQL not running**: Start MySQL service
   ```bash
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   
   # Windows
   net start MySQL
   ```

2. **Access denied**: Check username and password in application.properties

3. **Database not found**: Make sure you created the database:
   ```sql
   SHOW DATABASES;
   ```

### Data Import Issues

1. **File too large**: The test.sql file is very large. Increase MySQL packet size:
   ```sql
   SET GLOBAL max_allowed_packet=1073741824;
   ```

2. **Import timeout**: Use MySQL Workbench or split the file

3. **Character encoding issues**: Ensure UTF-8 encoding:
   ```sql
   ALTER DATABASE disney_db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
   ```

## Test Queries

After setup, test the database:

```sql
-- Check total characters
SELECT COUNT(*) FROM data;

-- Get character names
SELECT id, JSON_EXTRACT(data, '$.name') as name 
FROM data 
LIMIT 10;

-- Search for specific character
SELECT * FROM data 
WHERE JSON_EXTRACT(data, '$.name') = 'Mickey Mouse';

-- Check users
SELECT id, username, email, role, enabled FROM users;
```


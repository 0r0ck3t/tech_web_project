# 🏰 Disney Characters Management System

A modern, full-stack web application for managing Disney characters with advanced search, filtering, and role-based access control.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-brightgreen)
![Angular](https://img.shields.io/badge/Angular-17-red)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue)

## 📸 Features Overview

### 🔐 **Authentication & Authorization**
- User registration with validation
- Secure login with JWT tokens
- Password reset functionality
- Role-based access control (USER, EMPLOYEE, ADMIN)
- Protected routes with guards
- Account settings (update username/email/password)

### 👤 **User Features**
- Browse 112+ Disney characters with beautiful card layout
- Advanced search across multiple fields (name, films, TV shows, games, etc.)
- Category filtering (Films, TV Shows, Video Games, Park Attractions)
- Pagination with customizable items per page (10/20/50/100)
- View detailed character information
- Responsive sidebar navigation
- Account management

### 👷 **Employee Features**
- All user features
- Create new Disney characters
- Edit existing characters
- Delete characters
- Full CRUD operations on character data

### 👑 **Admin Features**
- All employee features
- **User Management Dashboard**
  - View all users in table format
  - Change user roles (USER ↔ EMPLOYEE ↔ ADMIN)
  - Enable/disable user accounts
  - Real-time updates

## 🚀 Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Programming language |
| Spring Boot | 3.1.5 | Application framework |
| Spring Security | Latest | JWT authentication & authorization |
| Spring Data JPA | Latest | Database ORM |
| MySQL | 8.0+ | Database |
| Maven | 3.6+ | Build tool |
| Lombok | Latest | Reduce boilerplate |
| JJWT | 0.11.5 | JWT token handling |
| Gson | Latest | JSON processing |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 17 | Frontend framework |
| TypeScript | 5.2 | Type-safe JavaScript |
| RxJS | 7.8 | Reactive programming |
| Standalone Components | - | Modern Angular architecture |
| HTTP Interceptors | - | Auto JWT injection |
| Route Guards | - | Access control |

## 📁 Project Structure

```
disney-characters-app/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/disney/
│   │   ├── controller/               # REST API Controllers
│   │   │   ├── AuthController.java   # Authentication endpoints
│   │   │   ├── CharacterController.java
│   │   │   └── UserAdminController.java
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── model/                    # JPA Entities
│   │   │   ├── User.java
│   │   │   └── DisneyCharacter.java
│   │   ├── repository/               # JPA Repositories
│   │   ├── security/                 # Security Configuration
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── JwtUtils.java
│   │   │   ├── SecurityConfig.java
│   │   │   └── UserDetailsServiceImpl.java
│   │   └── service/                  # Business Logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/                         # Angular Application
│   ├── src/app/
│   │   ├── components/               # UI Components (10+)
│   │   │   ├── start-page/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── reset-password/
│   │   │   ├── user-main/
│   │   │   ├── admin-main/
│   │   │   ├── character-view/
│   │   │   ├── character-edit/
│   │   │   ├── character-create/
│   │   │   ├── account-settings/
│   │   │   ├── manage-users/
│   │   │   └── sidebar/
│   │   ├── guards/                   # Route Protection
│   │   ├── interceptors/             # HTTP Interceptor
│   │   └── services/                 # API Services
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── test.sql                          # Disney characters database
├── create_admin.sql                  # Admin user creation script
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

Ensure you have the following installed:
- ☑️ Java 17 or higher ([Download](https://adoptium.net/))
- ☑️ Node.js 18+ and npm ([Download](https://nodejs.org/))
- ☑️ MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/))
- ☑️ Maven 3.6+ ([Download](https://maven.apache.org/download.cgi))

### Quick Start (5 Minutes)

#### 1️⃣ Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE disney_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import Disney characters data
mysql -u root -p disney_db < test.sql
```

#### 2️⃣ Backend Setup
```bash
cd backend

# Update application.properties with your MySQL credentials
# spring.datasource.password=YOUR_PASSWORD

# Start backend
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`

#### 3️⃣ Frontend Setup
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm start
```
Frontend runs at: `http://localhost:4200`

#### 4️⃣ Create Admin User
```bash
# After registering through the app, promote to admin:
mysql -u root -p disney_db -e "UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';"

# Or use the provided script:
mysql -u root -p disney_db < create_admin.sql
```

Default admin credentials (from script):
- Username: `admin`
- Password: `admin123`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/register` | User registration | ❌ |
| POST | `/api/auth/reset-password` | Password reset | ❌ |
| PUT | `/api/auth/update-account` | Update username/email | ✅ |

### Character Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/characters` | Get all characters | ✅ | Any |
| GET | `/api/characters/{id}` | Get character by ID | ✅ | Any |
| POST | `/api/characters` | Create character | ✅ | ADMIN/EMPLOYEE |
| PUT | `/api/characters/{id}` | Update character | ✅ | ADMIN/EMPLOYEE |
| DELETE | `/api/characters/{id}` | Delete character | ✅ | ADMIN/EMPLOYEE |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/admin/users` | Get all users | ✅ | ADMIN |
| PUT | `/api/admin/users/{id}/role` | Update user role | ✅ | ADMIN |
| PUT | `/api/admin/users/{id}/status` | Enable/disable user | ✅ | ADMIN |

## 🎮 User Roles

### 👤 USER
- ✅ Browse and search Disney characters
- ✅ View character details
- ✅ Use filters and pagination
- ✅ Update own account settings
- ❌ Cannot create/edit/delete characters
- ❌ Cannot manage users

### 👷 EMPLOYEE
- ✅ All USER permissions
- ✅ Create new characters
- ✅ Edit existing characters
- ✅ Delete characters
- ❌ Cannot manage users or change roles

### 👑 ADMIN
- ✅ All EMPLOYEE permissions
- ✅ View all users
- ✅ Change user roles
- ✅ Enable/disable user accounts
- ✅ Full system control

## ✨ Key Features

### 🔍 **Advanced Search**
Search across 8+ fields:
- Character names
- Films & Short Films
- TV Shows
- Video Games
- Park Attractions
- Allies & Enemies

**Real-time results** as you type!

### 🎯 **Category Filters**
Quick filter buttons with live counts:
- 🎬 **Has Films** - Characters in films
- 📺 **Has TV Shows** - Characters in TV shows
- 🎮 **Has Video Games** - Characters in games
- 🎡 **Has Park Attractions** - Characters in theme parks

**Combine search + filter** for precise results!

### 📄 **Smart Pagination**
- Select items per page: 10, 20, 50, or 100
- First, Previous, Next, Last navigation
- Shows: "Displaying 1-20 of 112 characters"
- Works seamlessly with search and filters

### 🎨 **Modern UI/UX**
- Beautiful gradient design
- Responsive layout (mobile-friendly)
- Smooth animations and transitions
- Sidebar navigation with active state tracking
- Card-based character display
- Form validation with feedback

## 🔒 Security Features

- **BCrypt** password hashing
- **JWT** stateless authentication
- **Role-based access control** (RBAC)
- **CORS** configuration
- **Protected API endpoints**
- **Route guards** on frontend
- **HTTP interceptors** for auto token injection
- **Session management** with automatic token refresh on username change

## 📊 Database Schema

### Users Table
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

### Data Table (Characters)
```sql
CREATE TABLE data (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data JSON NOT NULL
);
```

**Character JSON Structure:**
```json
{
  "name": "Character Name",
  "url": "https://api.disneyapi.dev/characters/123",
  "image": "data:image/png;base64,...",
  "films": ["Film 1", "Film 2"],
  "shortFilms": ["Short Film"],
  "tvShows": ["TV Show 1"],
  "videoGames": ["Game 1"],
  "parkAttractions": ["Attraction 1"],
  "allies": ["Ally 1"],
  "enemies": ["Enemy 1"]
}
```

## 🎯 Application Workflow

```
Start Page
    ├── Sign Up → Registration → Back to Start
    └── Log In → Authentication
                    ├── USER → User Main Page
                    │            └── View Characters → Character Detail
                    │
                    └── ADMIN/EMPLOYEE → Admin Main Page
                                          ├── View Characters → Character Detail
                                          ├── Create Character
                                          ├── Edit Character
                                          ├── Delete Character
                                          └── Manage Users (Admin only)
```

## 🖼️ Character Data

The application includes **112 Disney characters** from:
- Classic films (Mickey Mouse, Donald Duck, etc.)
- Modern animations (Frozen, Lion King, etc.)
- TV shows (Recess, Suite Life, etc.)
- Video games (Kingdom Hearts, etc.)
- Theme park attractions

Each character includes:
- High-quality images (base64 encoded)
- Filmography
- TV appearances
- Video game appearances
- Park attractions
- Character relationships (allies/enemies)

## 🔧 Development Guide

### Adding New Components

**Backend:**
```java
// 1. Create entity in model/
// 2. Create repository interface
// 3. Implement service logic
// 4. Create REST controller
// 5. Add security rules if needed
```

**Frontend:**
```typescript
// 1. Generate component: ng generate component my-component
// 2. Add route in app.routes.ts
// 3. Create service if needed
// 4. Add guard for protection
```

### Running in Development Mode

Both frontend and backend support **hot reload**:
- Backend: Changes auto-reload with Spring Boot DevTools
- Frontend: Changes auto-compile with Angular CLI

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
mvn verify
```

### Frontend Tests
```bash
cd frontend
npm test
npm run e2e
```

### Manual Testing

**Test Accounts:**
```
User:     testuser / test123
Employee: employee / employee123
Admin:    myadmin / admin123
```

**Test Scenarios:**
1. Search for "Mickey" → Should show Mickey-related characters
2. Filter by "🎬 Has Films" → Should show film characters
3. Create character as employee → Should work
4. Try manage users as employee → Should redirect
5. Manage users as admin → Should show all users

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Backend (8080)
lsof -i :8080
kill -9 <PID>

# Frontend (4200)
lsof -i :4200
kill -9 <PID>
```

### Database Connection Issues
1. Verify MySQL is running: `mysql -u root -p -e "SELECT 1;"`
2. Check credentials in `application.properties`
3. Ensure database exists: `SHOW DATABASES;`

### 403 Errors or Authentication Issues
1. Clear browser localStorage: `localStorage.clear()` in console (F12)
2. Logout and login again
3. Check browser console for token errors
4. Verify backend is running on port 8080

### 0 Characters After Username Change
**Fixed!** The application now:
- Auto-generates new JWT token when username changes
- Updates frontend token storage
- No logout required

**If still issues:** Simply logout and login with new username.

## 📦 Deployment

### Production Build

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/disney-app-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to web server
```

### Environment Variables

Update `application.properties` for production:
```properties
spring.datasource.url=jdbc:mysql://YOUR_HOST:3306/disney_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
app.jwt.secret=YOUR_SECURE_SECRET_KEY_HERE
```

## 🤝 Contributing

This is an educational project. Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes. Feel free to use it for learning and development.

## 👨‍💻 Author

Built as a demonstration of modern full-stack web development using:
- Java Spring Boot for robust backend
- Angular for dynamic frontend
- MySQL for data persistence
- JWT for secure authentication

## 🙏 Acknowledgments

- Disney API for character data
- Spring Boot community
- Angular community
- All contributors and testers

## 📞 Support

For issues and questions:
1. Check the [QUICK_START.md](QUICK_START.md) guide
2. Review [DATABASE_SETUP.md](DATABASE_SETUP.md) for database help
3. See [FIXES_COMPLETE.md](FIXES_COMPLETE.md) for common solutions
4. Open an issue on GitHub

## 🌟 Features Highlight

### Search & Discovery
- **Real-time search** across 8+ character fields
- **Smart filtering** by category with live counts
- **Pagination** with customizable page size
- **Instant results** - no page reload needed

### User Experience
- **Beautiful gradient UI** with smooth animations
- **Responsive design** - works on all devices
- **Sidebar navigation** with active state tracking
- **Form validation** with helpful error messages
- **Loading states** and success notifications

### Administration
- **User management table** with inline editing
- **Role management** - change user permissions
- **Account controls** - enable/disable users
- **Character CRUD** - full content management

### Security
- **Encrypted passwords** (BCrypt)
- **JWT authentication** with auto-refresh
- **Role-based permissions** enforced on backend and frontend
- **Protected routes** with Angular guards
- **CORS** configured for cross-origin requests

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack development with Java and TypeScript
- ✅ RESTful API design and implementation
- ✅ JWT authentication and authorization
- ✅ Role-based access control (RBAC)
- ✅ Database design with JPA/Hibernate
- ✅ Modern Angular architecture (Standalone Components)
- ✅ Reactive programming with RxJS
- ✅ Security best practices
- ✅ Responsive web design
- ✅ State management
- ✅ HTTP interceptors and guards

## 🚀 Getting Started

**See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.**

**Quick Start:**
```bash
# 1. Setup database
mysql -u root -p -e "CREATE DATABASE disney_db;"
mysql -u root -p disney_db < test.sql

# 2. Start backend
cd backend && mvn spring-boot:run

# 3. Start frontend (new terminal)
cd frontend && npm install && npm start

# 4. Open http://localhost:4200
```

**First Login:**
1. Click "Sign Up" and create an account
2. Or use default admin: `admin / admin123`

---

**⭐ Star this repository if you find it useful!**

**📖 Documentation:** Full guides available in project root
- `QUICK_START.md` - Get running in 5 minutes
- `DATABASE_SETUP.md` - Database configuration
- `SEARCH_AND_FILTER_GUIDE.md` - Feature documentation
- `FIXES_COMPLETE.md` - Troubleshooting guide

---

*Built with ❤️ using Java Spring Boot and Angular*

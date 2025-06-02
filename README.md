# AirTracker - Airline Management System

A modern airline management system built with React frontend and Django REST API backend.

## Features

- User authentication (login/signup)
- User profile management
- Dashboard for authenticated users
- Modern responsive UI

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling

### Backend
- Django 4.2
- Django REST Framework
- JWT Authentication
- **SQL Database Support:**
  - SQLite (default for development)
  - MySQL (recommended for production)
  - SQL Server (enterprise option)
  - PostgreSQL (alternative)
- CORS handling

## Project Structure

```
airline-tracker/
├── frontend/          # React application
├── backend/           # Django REST API
├── README.md
└── LICENSE
```

## Getting Started

### Backend Setup

1. Navigate to backend directory
```bash
cd backend
```

2. Create virtual environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Configure database
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database settings
# For SQLite (default): no changes needed
# For MySQL/SQL Server: update DB_ENGINE and credentials
```

5. Set up database
```bash
# Automated setup (recommended)
python setup_database.py

# Or manual setup
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

7. Start development server
```bash
python manage.py runserver
```

## Database Configuration

The application supports multiple SQL databases. See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed configuration instructions.

### Quick Database Setup

1. **SQLite (Default)** - No setup required
2. **MySQL** - Install MySQL, create database, update `.env`

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm start
```

## Environment Variables

Create `.env` files in both frontend and backend directories with appropriate configuration.

## API Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

## License

This project is licensed under the terms specified in the LICENSE file.
This is a project to mimic an airline company database as a course project for COMP306.

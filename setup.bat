@echo off
echo ================================
echo AirTracker - Complete Setup
echo ================================
echo.

echo Step 1: Setting up Backend (Django)...
echo =====================================
cd backend

echo Creating Python virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo Creating database migrations...
python manage.py makemigrations accounts

echo Applying database migrations...
python manage.py migrate

echo Backend setup complete!
echo.

echo Step 2: Setting up Frontend (React)...
echo ====================================
cd ..\frontend

echo Installing Node.js dependencies...
npm install

echo Frontend setup complete!
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the application:
echo.
echo 1. Backend (Terminal 1):
echo    cd backend
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo 2. Frontend (Terminal 2):
echo    cd frontend
echo    npm start
echo.
echo Don't forget to:
echo - Update backend\.env with your MySQL database credentials
echo - Create a Django superuser: python manage.py createsuperuser
echo.

pause

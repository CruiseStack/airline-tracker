@echo off
echo ===================================
echo  AirTracker Database Setup (Windows)
echo ===================================
echo.

cd /d "%~dp0"

echo Checking if .env file exists...
if not exist ".env" (
    echo Creating .env file from template...
    copy ".env.example" ".env"
    echo Please edit .env file with your database configuration
    echo Then run this script again.
    pause
    exit /b
)

echo Setting up Python virtual environment...
if not exist "venv" (
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo Setting up database...
python setup_database.py

echo.
echo ===================================
echo Setup complete!
echo To start the server, run:
echo   venv\Scripts\activate.bat
echo   python manage.py runserver
echo ===================================
pause

@echo off

echo Setting up AirTracker Backend...

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create database migrations
echo Creating database migrations...
python manage.py makemigrations
python manage.py makemigrations accounts

REM Apply migrations
echo Applying migrations...
python manage.py migrate

echo Backend setup complete!
echo To start the server, run: python manage.py runserver
echo Don't forget to:
echo 1. Update the .env file with your database credentials
echo 2. Create a superuser with: python manage.py createsuperuser

pause

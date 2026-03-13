import os

class Config:
    # Get the directory where this config.py file is located
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    
    # Secret key for securing sessions and JWT (use a real secret in production)
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-123'
    
    # Define the path to the SQLite database file
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'finance.db')
    
    # Disable event notifications to save memory
    SQLALCHEMY_TRACK_MODIFICATIONS = False
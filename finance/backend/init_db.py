from app import create_app, db
from app.models import Category, Transaction

app = create_app()

with app.app_context():
    print("Connecting to database defined in config.py...")
    # This creates the physical finance.db file
    db.create_all() 
    print("Success! Database 'finance.db' created in your backend folder.")
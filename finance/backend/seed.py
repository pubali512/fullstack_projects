from app import create_app, db
from app.models import Category, Transaction
from datetime import datetime

app = create_app()

with app.app_context():
    # 1. RECREATE THE DATABASE FILE
    db.create_all()

    # 2. Clear old data to avoid duplicates (if any exists)
    db.session.query(Transaction).delete()
    db.session.query(Category).delete()

    # 3. Create your five Categories
    cat_names = ['Grocery', 'Income', 'Housing', 'Entertainment', 'Utilities']
    db_categories = {}

    for name in cat_names:
        cat = Category(name=name)
        db.session.add(cat)
        db_categories[name] = cat
    
    db.session.commit()

    # 4. Add sample data with the 'is_recurring' field
    # Note: 'Income' and 'Housing' are usually Recurring; 'Grocery' is One-time.
    samples = [
        Transaction(
            amount=105.50, 
            description="Weekly Shop", 
            category_id=db_categories['Grocery'].id, 
            date=datetime(2026, 1, 10),
            is_recurring=False
        ),
        Transaction(
            amount=700.00, 
            description="Rent/Mortgage", 
            category_id=db_categories['Housing'].id, 
            date=datetime(2026, 2, 1),
            is_recurring=True
        ),
        Transaction(
            amount=143.85, 
            description="Electric Bill", 
            category_id=db_categories['Utilities'].id, 
            date=datetime(2026, 2, 5),
            is_recurring=True
        ),
        Transaction(
            amount=3500.00, 
            description="Monthly Salary", 
            category_id=db_categories['Income'].id, 
            date=datetime(2026, 2, 28),
            is_recurring=True
        ),
        Transaction(
            amount=143.85, 
            description="Electric Bill", 
            category_id=db_categories['Utilities'].id, 
            date=datetime(2026, 3, 1),
            is_recurring=True
        )
    ]

    db.session.add_all(samples)
    db.session.commit()
    print("Database recreated and synced with Categories!")
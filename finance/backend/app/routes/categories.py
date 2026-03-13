from flask import Blueprint, jsonify, request 
from app.models import Category, Transaction
from sqlalchemy import func
from app import db
from datetime import datetime

cat_bp = Blueprint('categories', __name__)

@cat_bp.route('/api/categories/analytics', methods=['GET'])
def get_category_analytics():
    # Fallback to current date if params are missing
    now = datetime.now()
    month = request.args.get('month', default=now.month, type=int)
    year = request.args.get('year', default=now.year, type=int)
    
    # Get the ID for 'Income' to exclude it from "Total Expenses"
    income_cat = Category.query.filter_by(name='Income').first()
    income_id = income_cat.id if income_cat else None

    # Calculate TOTAL SPENDING (Sum of all categories EXCEPT Income)
    total_spending = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.category_id != income_id,
        func.extract('month', Transaction.date) == month,
        func.extract('year', Transaction.date) == year
    ).scalar() or 0

    # Fetch all categories
    categories = Category.query.all()
    results = []
    
    for cat in categories:
        # Sum transactions for THIS specific category
        cat_total = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.category_id == cat.id,
            func.extract('month', Transaction.date) == month,
            func.extract('year', Transaction.date) == year
        ).scalar() or 0

        # Logical Calculation
        contribution = 0
        is_income = (cat.name == 'Income')
        
        # Only calculate contribution for expense categories
        if not is_income and total_spending > 0:
            contribution = (float(cat_total) / float(total_spending)) * 100

        results.append({
            "name": cat.name,
            "total_amount": float(cat_total),
            "contribution_pct": round(float(contribution), 1),
            "is_income": is_income
        })

    return jsonify(results)
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

    # Fetch all categories
    categories = Category.query.all()
    
    # Calculate Total Expenses (Strictly amounts < 0)
    total_expenses = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.amount < 0,
        func.extract('month', Transaction.date) == month,
        func.extract('year', Transaction.date) == year
    ).scalar() or 0

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
        # and use abs() because both cat_total and total_expenses are negative
        if not is_income and total_expenses < 0:
            contribution = (float(cat_total) / float(total_expenses)) * 100

        results.append({
            "name": cat.name,
            "total_amount": float(cat_total),
            "contribution_pct": round(float(contribution), 1),
            "is_income": is_income
        })

    return jsonify(results)
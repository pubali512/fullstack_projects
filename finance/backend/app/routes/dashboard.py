from flask import Blueprint, jsonify, request
from app.models import Transaction, Category
from app import db
from sqlalchemy import func
from datetime import datetime

dash_bp = Blueprint('dashboard', __name__)

from flask import Blueprint, jsonify, request
from app.models import Transaction, Category
from app import db
from sqlalchemy import func
from datetime import datetime

dash_bp = Blueprint('dashboard', __name__)

@dash_bp.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    # Fallback to current date if params are missing
    now = datetime.now()
    month = request.args.get('month', default=now.month, type=int)
    year = request.args.get('year', default=now.year, type=int)

    # Current Balance Logic: Sum everything. 
    # Positive (Income) + Negative (Expenses) = Real Balance.
    current_balance = db.session.query(func.sum(Transaction.amount)).scalar() or 0
    
    # Monthly Spend
    monthly_query = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.category_id != (db.session.query(Category.id).filter_by(name='Income').scalar()),
        func.extract('month', Transaction.date) == month,
        func.extract('year', Transaction.date) == year
    )
    
    monthly_spend = monthly_query.scalar() or 0

    return jsonify({
        "currentBalance": float(current_balance),
        "monthlySpend": float(monthly_spend),
        "selectedPeriod": f"{month}/{year}"
    })
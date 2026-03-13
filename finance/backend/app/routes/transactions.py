from flask import Blueprint, jsonify, request
from app.models import Transaction, Category
from app import db
from datetime import datetime
#   from sqlalchemy import func

ts_bp = Blueprint('transactions', __name__)

# --- GET ALL TRANSACTIONS ---
@ts_bp.route('/api/transactions', methods=['GET'])
def get_transactions():
    # Capture the start and end dates from the URL
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)  # Offset: For pagination (e.g., page 2 would be offset=10 if limit=10)
    
    query = Transaction.query

    # Conditional Filtering
    # Only filter by date if BOTH are provided (Dashboard mode)
    # If missing, it returns the most recent history (Transactions page mode)
    if start_date and end_date and start_date.strip() and end_date.strip():
        query = query.filter(Transaction.date.between(start_date, end_date))
    
    # Apply Pagination & Sorting
    # This happens regardless of whether dates are picked or not
    transactions = query.order_by(Transaction.date.desc()).offset(offset).limit(limit).all()
    
    return jsonify([{
        "id": t.id,
        "date": t.date.strftime('%Y-%m-%d'),
        "description": t.description,
        "category": t.category_ref.name,
        "amount": float(t.amount),
        "status": "Recurring" if t.is_recurring else "One-time"
    } for t in transactions])

# --- CREATE NEW TRANSACTION (The "New Entry" Pop-up) ---
@ts_bp.route('/api/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    
    # Map category name from dropdown to Category ID
    category = Category.query.filter_by(name=data.get('category')).first()
    if not category:
        return jsonify({"error": f"Category '{data.get('category')}' not found"}), 400

    new_ts = Transaction(
        description=data.get('description'),
        amount=float(data.get('amount')),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d'),
        category_id=category.id,
        is_recurring=(data.get('status') == 'Recurring')
    )

    db.session.add(new_ts)
    db.session.commit()
    return jsonify({"message": "Transaction created!", "id": new_ts.id}), 201

# --- EDIT TRANSACTION (The Pencil Icon) ---
@ts_bp.route('/api/transactions/<int:id>', methods=['PUT'])
def update_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    data = request.get_json()

    # Update category if it changed
    if 'category' in data:
        category = Category.query.filter_by(name=data.get('category')).first()
        if category:
            transaction.category_id = category.id

    # Update other fields
    transaction.description = data.get('description', transaction.description)
    transaction.amount = float(data.get('amount', transaction.amount))
    if 'date' in data:
        transaction.date = datetime.strptime(data.get('date'), '%Y-%m-%d')
    transaction.is_recurring = (data.get('status') == 'Recurring')

    db.session.commit()
    return jsonify({"message": "Transaction updated successfully"})

# --- DELETE TRANSACTION (The Trash Icon) ---
@ts_bp.route('/api/transactions/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction deleted"})
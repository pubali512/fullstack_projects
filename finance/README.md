# Finance Manager

## Project Overview

A personal finance management application with a **Flask REST API backend** and a **React single-page application frontend**. The app allows users to track transactions, view financial dashboards, and analyze spending by category.

### Main Features

- **Dashboard** — View current balance, monthly expenditure, search transaction history, view statements filtered by date range with pagination and "Load More", export transactions to CSV, and switch display currency (EUR/USD/GBP/INR/JPY)
- **Transactions** — Full CRUD operations: list, add (via modal popup), inline edit, and delete transactions. Each transaction has a date, description, category, amount, and recurring/one-time status. Supports pagination with configurable page size (10–100) and search/filter
- **Category Analytics** — View per-category spending analytics for a selected month/year with contribution percentage bars. Income is separated from expense categories
- **Multi-currency display** — Switch between currencies with automatic conversion using built-in exchange rates (persisted in localStorage)

## Technologies Used & Installation Instructions

### Technologies

#### Backend
- **Python 3**
- **Flask 3.1** — Web framework
- **Flask-SQLAlchemy 3.1** — ORM with SQLAlchemy 2.0
- **Flask-Migrate 4.1** — Database migrations with Alembic
- **Flask-CORS 6.0** — Cross-origin resource sharing
- **Flask-JWT-Extended 4.7** — JWT authentication support
- **SQLite** — Database (file: `finance.db`)
- **python-dotenv** — Environment variable management

#### Frontend
- **React 19** with **Vite 7**
- **React Router DOM 7** — Client-side routing
- **Axios** — HTTP client
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **Lucide React** — Icon library
- **ESLint** — Code linting

### Prerequisites

- **Backend:** Python 3.x, pip
- **Frontend:** Node.js (>= 18), npm

### Installation

#### Backend Setup

```bash
cd fullstack_projects/finance/backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Initialize the database
python init_db.py

# Seed sample data
python seed.py
```

#### Frontend Setup

```bash
cd fullstack_projects/finance/frontend
npm install
```

## Usage Instructions

### Starting the Application

#### 1. Start the Backend

```bash
cd fullstack_projects/finance/backend
venv\Scripts\activate          # Windows
python run.py
```

The Flask server starts on `http://127.0.0.1:5000`.

#### 2. Start the Frontend

```bash
cd fullstack_projects/finance/frontend
npm run dev
```

The Vite dev server starts on `http://localhost:5173`.

#### 3. Open the Application

Navigate to `http://localhost:5173` in your browser.

### Frontend Routes

| Path             | Page          | Description                              |
|------------------|---------------|------------------------------------------|
| `/`              | Dashboard     | Financial overview, stats, statement     |
| `/transactions`  | Transactions  | CRUD transactions table with pagination  |
| `/categories`    | Categories    | Analytics by category with visual bars   |

### API Endpoints

| Method | Endpoint                            | Description                                         |
|--------|-------------------------------------|-----------------------------------------------------|
| GET    | `/api/transactions`                 | List transactions (query params: `start_date`, `end_date`, `limit`, `offset`) |
| POST   | `/api/transactions`                 | Create a new transaction                            |
| PUT    | `/api/transactions/<id>`            | Update an existing transaction                      |
| DELETE | `/api/transactions/<id>`            | Delete a transaction                                |
| GET    | `/api/categories/analytics`         | Category spending analytics (query params: `month`, `year`) |
| GET    | `/api/dashboard/stats`              | Dashboard statistics (query params: `month`, `year`) |

### Configuration

| Setting             | Location                  | Default Value               |
|---------------------|---------------------------|-----------------------------|
| Secret Key          | `SECRET_KEY` env variable | `dev-secret-key-123`        |
| Database            | `backend/config.py`       | `sqlite:///finance.db`      |
| Backend API URL     | `frontend/src/services/api.js` | `http://127.0.0.1:5000/api` |

### Data Model

- **Category** — `id`, `name` (unique). One-to-many relationship with Transaction.
- **Transaction** — `id`, `date`, `description`, `amount`, `category_id` (FK), `is_recurring` (boolean)
- Seeded categories: Grocery, Income, Housing, Entertainment, Utilities

### Project Structure

```
finance/
├── instructions.md
├── backend/
│   ├── config.py             # Database path and secret key
│   ├── init_db.py            # Database initialization script
│   ├── requirements.txt      # Python dependencies
│   ├── run.py                # Flask application entry point
│   ├── seed.py               # Sample data seeder
│   └── app/
│       ├── __init__.py       # Flask app factory with CORS and migration setup
│       ├── models.py         # SQLAlchemy models (Category, Transaction)
│       ├── utils.py          # Utility functions
│       └── routes/           # API route blueprints
└── frontend/
    ├── package.json          # Node.js dependencies
    ├── vite.config.js        # Vite config with React and Tailwind plugins
    ├── tailwind.config.js    # Tailwind CSS configuration
    ├── index.html            # HTML entry point
    └── src/
        ├── App.jsx           # Root component with routing
        ├── main.jsx          # React entry point
        ├── index.css         # Tailwind v4 imports
        ├── components/       # Reusable UI components
        ├── context/          # React context (CurrencyContext)
        ├── pages/            # Page components (Dashboard, Transactions, Categories)
        └── services/         # API client, mock data, currency configs
```

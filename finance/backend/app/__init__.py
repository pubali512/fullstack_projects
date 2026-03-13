from flask import Flask, app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config

# These will be initialized in the factory
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Allow the React app (usually port 3000 or 5173) to talk to Flask
    CORS(app)
    
    # Configuration (to be added DB path here later)
    app.config.from_object(Config)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    # Registering routes (Blueprints)
    from app.routes.transactions import ts_bp
    app.register_blueprint(ts_bp)
    
    from app.routes.categories import cat_bp
    app.register_blueprint(cat_bp)
    
    from app.routes.dashboard import dash_bp
    app.register_blueprint(dash_bp)

    return app  
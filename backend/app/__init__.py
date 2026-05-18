from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    
    from app.config import Config
    app.config.from_object(Config)
    
    origins = ["http://localhost:5173", "http://localhost:5174"]
    frontend_url = app.config.get("FRONTEND_URL")
    if frontend_url:
        # Strip trailing slash if present
        cleaned_url = frontend_url.rstrip('/')
        if cleaned_url not in origins:
            origins.append(cleaned_url)
            
    CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.cover_letters import cover_letters_bp
    from app.routes.users import users_bp
    from app.routes.templates import templates_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(cover_letters_bp, url_prefix='/api/cover-letters')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(templates_bp, url_prefix='/api/templates')
    
    @app.route('/')
    @app.route('/api')
    def index():
        return {
            "status": "online", 
            "message": "Welcome to the Cover Letter Generator API. The server is running successfully! Please use the React frontend to interact with the application."
        }
    
    with app.app_context():
        db.create_all()
    
    return app

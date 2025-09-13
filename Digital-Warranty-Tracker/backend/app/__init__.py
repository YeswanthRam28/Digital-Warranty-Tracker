from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from app.extensions import db
from app.routes.warranty_routes import warranties_bp

migrate = Migrate()  # ✅ Migration support

def create_app():
    app = Flask(__name__)

    # Database configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///warranties.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Enable CORS for frontend requests
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    try:
        app.register_blueprint(warranties_bp)  # already has url_prefix
        print("✅ Blueprint registered successfully")
    except Exception as e:
        print("❌ Error registering blueprint:", e)

    # Health check routes
    @app.route("/")
    def home():
        return "🚀 Digital Warranty Tracker Backend is Running"

    @app.route("/health")
    def health():
        return {"status": "ok", "message": "Backend is healthy"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

from flask import Flask
from flask_cors import CORS
from app.extensions import db
from app.routes.warranty_routes import warranties_bp


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///warranties.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize DB
    db.init_app(app)

    # Enable CORS for frontend (all origins for /api/*)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    print("Registering blueprint...")
    try:
        app.register_blueprint(warranties_bp)  # Already has url_prefix in definition
        print("Blueprint registered successfully ✅")
    except Exception as e:
        print("❌ Error registering blueprint:", e)

    # Health check routes
    @app.route("/")
    def home():
        return "Digital Warranty Tracker Backend is Running"

    @app.route("/health")
    def health():
        return {"status": "ok", "message": "Backend is healthy"}

    return app


if __name__ == "__main__":
    app = create_app()

    # Create tables if not exist
    with app.app_context():
        from app.models.warranty import Warranty
        db.create_all()
        print("Database initialized ✅")

    app.run(debug=True)

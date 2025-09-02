from flask import Flask
from app.extensions import db

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///warranties.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    print("Registering blueprint...")
    try:
        from app.routes.warranty_routes import warranty_bp
        app.register_blueprint(warranty_bp, url_prefix="/api/warranties")
        print("Blueprint registered successfully")
    except Exception as e:
        print("Error registering blueprint:", e)

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
    app.run(debug=True)

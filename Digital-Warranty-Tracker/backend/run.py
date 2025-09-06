from app import create_app
from app.extensions import db
from flask_cors import CORS
from app.models.warranty import Warranty

app = create_app()

# Create database tables if they don't exist
with app.app_context():
    db.create_all()
    print("Database tables created or already exist.")

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

if __name__ == "__main__":
    app.run(debug=True)

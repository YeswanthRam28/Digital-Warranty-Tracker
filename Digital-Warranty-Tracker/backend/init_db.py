from app import create_app
from app.models import db

# Create the Flask app
app = create_app()

# Create all database tables
with app.app_context():
    db.create_all()
    print("✅ Database initialized successfully (warranties.db created)!")

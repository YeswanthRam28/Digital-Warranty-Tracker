from app import create_app
from app.extensions import db
from flask_cors import CORS
from app.models.warranty import Warranty
from app.notificationscheduler import run_scheduler
from app.routes.notifications import notifications

app = create_app()
app.register_blueprint(notifications, url_prefix="/api")

with app.app_context():
    db.create_all()
    print("✅ Database tables ready")

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# ✅ Start scheduler
run_scheduler()

if __name__ == "__main__":
    app.run(debug=True)

from app.extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    fcm_token = db.Column(db.String(500), nullable=True)  # 🔑 store device token

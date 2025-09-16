from flask import Blueprint, request, jsonify
from app.models.user import User
from app.extensions import db

notifications = Blueprint("notifications", __name__)

@notifications.route("/save-token", methods=["POST"])
def save_token():
    data = request.get_json()
    user_id = data.get("user_id")   # frontend should send this
    token = data.get("fcm_token")

    if not user_id or not token:
        return jsonify({"error": "Missing user_id or token"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.fcm_token = token
    db.session.commit()

    return jsonify({"message": "✅ Token saved successfully!"})

from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.warranty import Warranty
from datetime import datetime

# ✅ Consistent blueprint name + URL prefix
warranties_bp = Blueprint("warranties", __name__, url_prefix="/api/warranties")

# ➤ Get all warranties
@warranties_bp.route("/", methods=["GET"])
def get_warranties():
    warranties = Warranty.query.all()
    return jsonify([w.to_dict() for w in warranties])

# ➤ Add new warranty
@warranties_bp.route("/", methods=["POST"])
def add_warranty():
    data = request.get_json()

    new_warranty = Warranty(
        product_name=data.get("product_name", ""),
        purchase_date=datetime.strptime(data.get("purchase_date"), "%Y-%m-%d").date(),
        expiry_date=datetime.strptime(data.get("expiry_date"), "%Y-%m-%d").date(),
        vendor=data.get("vendor", ""),
    )
    db.session.add(new_warranty)
    db.session.commit()

    return jsonify(new_warranty.to_dict()), 201


# ➤ Update warranty
@warranties_bp.route("/<int:id>", methods=["PUT"])
def update_warranty(id):
    warranty = Warranty.query.get_or_404(id)
    data = request.get_json()

    warranty.product_name = data.get("product_name", warranty.product_name)
    if "purchase_date" in data:
        warranty.purchase_date = datetime.strptime(data["purchase_date"], "%Y-%m-%d").date()
    if "expiry_date" in data:
        warranty.expiry_date = datetime.strptime(data["expiry_date"], "%Y-%m-%d").date()
    warranty.vendor = data.get("vendor", warranty.vendor)

    db.session.commit()
    return jsonify(warranty.to_dict())


# ➤ Delete warranty
@warranties_bp.route("/<int:id>", methods=["DELETE"])
def delete_warranty(id):
    warranty = Warranty.query.get_or_404(id)
    db.session.delete(warranty)
    db.session.commit()
    return jsonify({"message": "Warranty deleted successfully"})

# ➤ Test route
@warranties_bp.route("/test", methods=["GET"])
def test_route():
    return {"message": "Blueprint is working!"}

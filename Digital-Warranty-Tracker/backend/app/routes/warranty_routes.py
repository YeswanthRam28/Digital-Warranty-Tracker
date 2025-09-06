from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.warranty import Warranty

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
    print("Incoming JSON:", data)  # ✅ Debug log

    if not data:
        return jsonify({"error": "No JSON received"}), 400

    new_warranty = Warranty(
        product_name=data.get("product_name", ""),
        purchase_date=data.get("purchase_date", ""),
        vendor=data.get("vendor", ""),
        expiry_date=data.get("expiry_date", ""),  # keep for consistency
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
    warranty.purchase_date = data.get("purchase_date", warranty.purchase_date)
    warranty.expiry_date = data.get("expiry_date", warranty.expiry_date)    
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

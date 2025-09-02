from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.warranty import Warranty

warranty_bp = Blueprint("warranty_bp", __name__)

# ➤ Get all warranties
@warranty_bp.route("/", methods=["GET"])
def get_warranties():
    warranties = Warranty.query.all()
    return jsonify([w.to_dict() for w in warranties])

# ➤ Add new warranty
@warranty_bp.route("/", methods=["POST"])
def add_warranty():
    data = request.get_json()
    new_warranty = Warranty(
        product_name=data["product_name"],
        purchase_date=data["purchase_date"],
        expiry_date=data["expiry_date"],
        details=data.get("details", "")
    )
    db.session.add(new_warranty)
    db.session.commit()
    return jsonify({"message": "Warranty added successfully"}), 201

# ➤ Update warranty
@warranty_bp.route("/<int:id>", methods=["PUT"])
def update_warranty(id):
    warranty = Warranty.query.get_or_404(id)
    data = request.get_json()

    warranty.product_name = data.get("product_name", warranty.product_name)
    warranty.purchase_date = data.get("purchase_date", warranty.purchase_date)
    warranty.expiry_date = data.get("expiry_date", warranty.expiry_date)
    warranty.details = data.get("details", warranty.details)

    db.session.commit()
    return jsonify({"message": "Warranty updated successfully"})

# ➤ Delete warranty
@warranty_bp.route("/<int:id>", methods=["DELETE"])
def delete_warranty(id):
    warranty = Warranty.query.get_or_404(id)
    db.session.delete(warranty)
    db.session.commit()
    return jsonify({"message": "Warranty deleted successfully"})

# ➤ Test route
@warranty_bp.route("/test", methods=["GET"])
def test_route():
    return {"message": "Blueprint is working!"}

from app.extensions import db

class Warranty(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(100), nullable=False)
    purchase_date = db.Column(db.String(20), nullable=False)
    vendor = db.Column(db.String(50))
    expiry_date = db.Column(db.String(20))

    def to_dict(self):
        return {
            "id": self.id,
            "product_name": self.product_name,
            "purchase_date": self.purchase_date,
            "vendor": self.vendor,
            "expiry_date": self.expiry_date
        }

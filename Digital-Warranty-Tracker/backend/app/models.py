from app.extensions import db
from datetime import datetime, date, timedelta

class Warranty(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(100), nullable=False)
    purchase_date = db.Column(db.Date, nullable=False)
    expiry_date = db.Column(db.Date, nullable=False)
    vendor = db.Column(db.String(100))

    def days_left(self):
        today = date.today()
        return (self.expiry_date - today).days

    def to_dict(self):
        return {
            "id": self.id,
            "product_name": self.product_name,
            "purchase_date": self.purchase_date.strftime("%Y-%m-%d"),
            "expiry_date": self.expiry_date.strftime("%Y-%m-%d"),
            "vendor": self.vendor,
            "days_left": self.days_left(),
        }

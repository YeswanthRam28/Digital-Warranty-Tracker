# app/notificationscheduler.py
import os
import logging
from datetime import datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler
from firebase_admin import credentials, initialize_app, messaging
from app.models.warranty import Warranty
from app.extensions import db

# -----------------------------------
# 🔹 Logging
# -----------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("NotificationScheduler")

# -----------------------------------
# 🔹 Firebase Setup
# -----------------------------------
FIREBASE_CRED_FILE = "firebase-adminsdk.json"
firebase_app = None

def init_firebase():
    """Initialize Firebase Admin SDK (only once)."""
    global firebase_app
    if firebase_app:
        return firebase_app  # already initialized

    if not os.path.exists(FIREBASE_CRED_FILE):
        logger.error(f"❌ Firebase credential file not found: {FIREBASE_CRED_FILE}")
        return None

    try:
        cred = credentials.Certificate(FIREBASE_CRED_FILE)
        firebase_app = initialize_app(cred)
        logger.info("✅ Firebase Admin SDK initialized successfully")
        return firebase_app
    except Exception as e:
        logger.error(f"❌ Failed to initialize Firebase: {e}")
        return None

firebase_app = init_firebase()

# -----------------------------------
# 🔹 Warranty Expiry Check
# -----------------------------------
def check_expiring_warranties():
    """Check warranties expiring within 7 days and send notifications"""
    with db.session.begin():
        today = datetime.utcnow().date()
        soon = today + timedelta(days=7)

        expiring_warranties = Warranty.query.filter(
            Warranty.expiry_date >= today,
            Warranty.expiry_date <= soon
        ).all()

        if not expiring_warranties:
            logger.info("✅ No warranties expiring within 7 days.")
            return

        logger.info(f"⚠️ Found {len(expiring_warranties)} warranties expiring soon.")

        for w in expiring_warranties:
            logger.info(f"   • {w.product_name} (expires {w.expiry_date})")

            if firebase_app:
                try:
                    message = messaging.Message(
                        notification=messaging.Notification(
                            title="⚠️ Warranty Expiring Soon!",
                            body=f"{w.product_name} expires on {w.expiry_date}",
                        ),
                        topic="warranty_alerts",  # all subscribed users
                    )
                    response = messaging.send(message)
                    logger.info(f"📩 Notification sent for {w.product_name}: {response}")
                except Exception as e:
                    logger.error(f"❌ Error sending notification for {w.product_name}: {e}")

# -----------------------------------
# 🔹 Scheduler Setup
# -----------------------------------
def run_scheduler():
    """Start APScheduler for periodic warranty checks"""
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_expiring_warranties, "interval", hours=24)  # check daily
    scheduler.start()
    logger.info("✅ Notification scheduler started (runs every 24 hours)")
    return scheduler

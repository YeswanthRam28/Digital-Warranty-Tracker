from flask import Flask

def create_app():
    app = Flask(__name__)

    @app.route("/")
    def home():
        return "Digital Warranty Tracker Backend is Running 🚀"

    @app.route("/health")
    def health():
        return {"status": "ok", "message": "Backend is healthy ✅"}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

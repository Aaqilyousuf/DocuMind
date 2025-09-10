from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from routes.upload import upload_bp
from routes.query import query_bp
from routes.files import files_bp


def create_app():
    app = Flask(__name__)

    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Register routes
    app.register_blueprint(upload_bp, url_prefix="/api/v1")
    app.register_blueprint(query_bp, url_prefix="/api/v1")
    app.register_blueprint(files_bp, url_prefix="/api/v1")

    @app.route("/")
    def home():
        return {"message": "DocuMind API is running!"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)

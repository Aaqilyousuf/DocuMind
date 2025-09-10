from flask import Blueprint, request, jsonify
import os
import tempfile
from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.input_file import InputFile
from services import file_processor

upload_bp = Blueprint("upload", __name__)

# Initialize Appwrite client
client = Client()
client.set_endpoint(os.getenv("APPWRITE_ENDPOINT"))
client.set_project(os.getenv("APPWRITE_PROJECT_ID"))
client.set_key(os.getenv("APPWRITE_API_KEY"))
print(os.getenv("APPWRITE_ENDPOINT"))

storage = Storage(client)


@upload_bp.route("/upload", methods=["POST"])
def upload_document():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    user_id = request.form.get("user_id")  # Get user_id from frontend
    if not user_id:
        return jsonify({"error": "No user_id provided"}), 400

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Step 1: Save the uploaded file temporarily
        suffix = os.path.splitext(file.filename)[1] or ""
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name

        # Step 2: Process the file locally for RAG embeddings, include user_id
        file_processor.process_and_store_file(
            file_source=temp_file_path,
            id_prefix=file.filename,
            user_id=user_id,  # Pass user_id to processor
            is_url=False
        )

        # Step 3: Upload the file to Appwrite Storage
        input_file = InputFile.from_path(temp_file_path)
        uploaded_file = storage.create_file(
            bucket_id=os.getenv("APPWRITE_BUCKET_ID"),
            file_id="unique()",
            file=input_file
        )

        # Step 4: Delete the temporary local file
        os.remove(temp_file_path)

        # Step 5: Return metadata to frontend
        return jsonify({
            "message": "Document uploaded and indexed successfully",
            "fileName": uploaded_file["name"],
            "fileId": uploaded_file["$id"],
            "userId": user_id  # Return user_id for frontend
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
from flask import Blueprint, request, jsonify
from services.storage import list_files, get_file_info, delete_file
from services.vectorstore import filter_by_user_id, delete_user_documents
import os

files_bp = Blueprint("files", __name__)

BUCKET_ID = os.getenv("APPWRITE_BUCKET_ID")


@files_bp.route("/files", methods=["GET"])
def get_files():
    user_id = request.args.get("user_id")  # Get user_id from frontend
    if not user_id:
        return jsonify({"error": "No user_id provided"}), 400
    
    try:
        # Get user's documents from vectorstore (ensures user isolation)
        vector_docs = filter_by_user_id(user_id)
        
        # Get all files from Appwrite storage for additional metadata
        all_files = list_files(BUCKET_ID)
        
        # Create a lookup dictionary for Appwrite files by name
        appwrite_files_lookup = {}
        if isinstance(all_files, list):
            for file in all_files:
                file_name = file.get("name", "")
                appwrite_files_lookup[file_name] = file
        
        # Combine vectorstore data with Appwrite metadata
        user_files = []
        for doc in vector_docs:
            file_name = doc.get("fileName", "")
            appwrite_file = appwrite_files_lookup.get(file_name, {})
            
            user_files.append({
                "fileId": appwrite_file.get("$id", ""),
                "fileName": file_name,
                "mimeType": appwrite_file.get("mimeType", "application/pdf"),
                "upload_time": appwrite_file.get("$createdAt", ""),
                "size": appwrite_file.get("sizeOriginal", 0),
                "chunk_count": doc.get("chunk_count", 0)
            })
        
        return jsonify({"files": user_files, "count": len(user_files)})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@files_bp.route("/files/test-delete/<file_id>", methods=["GET"])
def test_delete_endpoint(file_id):
    """Test endpoint to verify delete route accessibility"""
    user_id = request.args.get("user_id")
    return jsonify({
        "message": "Delete endpoint accessible",
        "file_id": file_id,
        "user_id": user_id
    })


@files_bp.route("/files/<file_id>", methods=["DELETE"])
def delete_file_endpoint(file_id):
    user_id = request.args.get("user_id")
    
    print(f"DELETE request received: file_id={file_id}, user_id={user_id}")
    
    if not file_id or not user_id:
        error_msg = "file_id and user_id are required"
        print(f"Error: {error_msg}")
        return jsonify({"error": error_msg}), 400
    
    try:
        print(f"Getting file info for file_id: {file_id}")
        # Get file info first to verify it exists and get filename
        file_info = get_file_info(BUCKET_ID, file_id)
        print(f"File info retrieved: {file_info}")
        
        if not file_info:
            error_msg = "File not found"
            print(f"Error: {error_msg}")
            return jsonify({"error": error_msg}), 404
            
        file_name = file_info.get("name", "")
        print(f"File name: {file_name}")
        
        # Delete from Appwrite storage
        print(f"Deleting from Appwrite storage: bucket_id={BUCKET_ID}, file_id={file_id}")
        storage_result = delete_file(BUCKET_ID, file_id)
        print(f"Storage delete result: {storage_result}")
        
        if not storage_result:
            error_msg = "Failed to delete file from storage"
            print(f"Error: {error_msg}")
            return jsonify({"error": error_msg}), 500
        
        # Delete from vectorstore (all chunks for this file and user)
        print(f"Deleting from vectorstore: user_id={user_id}, file_name={file_name}")
        deleted_chunks = delete_user_documents(user_id, file_name)
        print(f"Deleted {deleted_chunks} chunks from vectorstore")
        
        success_msg = "File deleted successfully"
        print(f"Success: {success_msg}")
        return jsonify({"message": success_msg}), 200
        
    except Exception as e:
        error_msg = str(e)
        print(f"Exception in delete_file_endpoint: {error_msg}")
        return jsonify({"error": error_msg}), 500
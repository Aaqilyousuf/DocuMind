import os
from appwrite.client import Client
from appwrite.services.storage import Storage

# Setup Appwrite client
client = Client()
client.set_endpoint(os.getenv("APPWRITE_ENDPOINT"))  # e.g. http://localhost/v1
client.set_project(os.getenv("APPWRITE_PROJECT_ID"))
client.set_key(os.getenv("APPWRITE_API_KEY"))

storage = Storage(client)


def list_files(bucket_id: str):
    """List all files in a bucket"""
    try:
        result = storage.list_files(bucket_id=bucket_id)
        return result.get("files", [])
    except Exception as e:
        print(f"Error listing files: {e}")
        return []


def get_file_info(bucket_id: str, file_id: str):
    """Get information about a specific file"""
    try:
        file_info = storage.get_file(bucket_id=bucket_id, file_id=file_id)
        return file_info
    except Exception as e:
        print(f"Error getting file info: {e}")
        return None


def delete_file(bucket_id: str, file_id: str):
    """Delete a file from storage"""
    try:
        result = storage.delete_file(bucket_id=bucket_id, file_id=file_id)
        return result
    except Exception as e:
        print(f"Error deleting file: {e}")
        return None

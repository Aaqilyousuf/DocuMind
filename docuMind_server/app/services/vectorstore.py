import os
from pinecone import Pinecone, ServerlessSpec

# Initialize Pinecone client
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY environment variable not set")

pc = Pinecone(api_key=PINECONE_API_KEY)

# Create or connect to index
index_name = "documind-index"

# Nomic embeddings are 768-dim
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=768,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

# Connect to index
index = pc.Index(index_name)

def upsert_document(id: str, embedding: list, metadata: dict, user_id: str):
    """Insert or update a document in Pinecone with user_id in metadata"""
    if not embedding:
        print(f"⚠️ Skipping empty embedding for {id}")
        return
    if len(embedding) != 768:
        print(f"⚠️ Dimension mismatch: got {len(embedding)} expected 768")
    
    # Ensure user_id is in metadata
    metadata["user_id"] = user_id
    index.upsert([(id, embedding, metadata)])

def query_documents(embedding: list, top_k: int = 3, user_id: str = None):
    """Query documents by embedding similarity, optionally filtered by user_id"""
    query_params = {"vector": embedding, "top_k": top_k, "include_metadata": True}
    
    # Add filter for user_id if provided
    if user_id:
        query_params["filter"] = {"user_id": {"$eq": user_id}}
    
    results = index.query(**query_params)
    return results["matches"]

# Optional: Function to list all documents for a user (for /files endpoint)
def filter_by_user_id(user_id: str):
    """Fetch all documents for a specific user_id"""
    try:
        results = index.query(
            vector=[0] * 768,  # Placeholder embedding
            filter={"user_id": {"$eq": user_id}},
            top_k=1000,  # Fetch all relevant documents
            include_metadata=True
        )
        
        # Extract unique file names from the results
        unique_files = {}
        for match in results.get("matches", []):
            metadata = match.get("metadata", {})
            source = metadata.get("source", "")
            if source and source not in unique_files:
                unique_files[source] = {
                    "fileName": source,
                    "source": source,
                    "chunk_count": 1
                }
            elif source in unique_files:
                unique_files[source]["chunk_count"] += 1
                
        return list(unique_files.values())
    except Exception as e:
        print(f"Error filtering by user_id: {e}")
        return []


def delete_user_documents(user_id: str, file_name: str):
    """Delete all document chunks for a specific user and file"""
    try:
        # First, query to find all chunks for this user and file
        results = index.query(
            vector=[0] * EMBEDDING_DIMENSION,  # Placeholder embedding
            filter={
                "user_id": {"$eq": user_id},
                "source": {"$eq": file_name}
            },
            top_k=1000,  # Get all chunks
            include_metadata=True
        )
        
        # Extract the IDs of all chunks to delete
        ids_to_delete = [match["id"] for match in results.get("matches", [])]
        
        if ids_to_delete:
            # Delete all the chunks
            index.delete(ids=ids_to_delete)
            print(f"Deleted {len(ids_to_delete)} chunks for user {user_id}, file {file_name}")
        
        return len(ids_to_delete)
    except Exception as e:
        print(f"Error deleting user documents: {e}")
        return 0
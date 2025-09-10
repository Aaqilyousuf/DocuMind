import os
import requests
from io import BytesIO
from . import file_parser, chunking, embeddings, vectorstore


def process_and_store_file(file_source: str, id_prefix: str, user_id: str, is_url: bool = True) -> None:
    if is_url:
        try:
            response = requests.get(file_source)
            response.raise_for_status()
            file_bytes = BytesIO(response.content)
            filename_hint = os.path.basename(file_source)
            file_for_parser = file_bytes
        except Exception as e:
            raise RuntimeError(f"Error downloading file from URL: {e}")
    else:
        if not os.path.exists(file_source):
            raise FileNotFoundError(f"Local file does not exist: {file_source}")
        file_for_parser = file_source
        filename_hint = os.path.basename(file_source)

    # Step 2: Extract text
    try:
        text = file_parser.extract_text(file_for_parser, filename_hint=filename_hint)
    except Exception as e:
        raise RuntimeError(f"Error extracting text: {e}")

    # Step 3: Split into chunks
    if not text:
        raise ValueError("No text extracted from file.")
    chunks = chunking.split_into_chunks(text)

    # Step 4: Embeddings + vectorstore
    for i, chunk in enumerate(chunks):
        try:
            embedding = embeddings.get_embedding(chunk, task_prefix="search_document")
            metadata = {"source": filename_hint, "chunk_id": i, "text": chunk}
            vectorstore.upsert_document(f"{id_prefix}_{i}", embedding, metadata, user_id)
        except Exception as e:
            raise RuntimeError(f"Error embedding chunk {i}: {e}")


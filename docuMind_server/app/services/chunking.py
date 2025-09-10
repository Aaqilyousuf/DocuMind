def split_into_chunks(text: str, max_tokens: int = 500, overlap: int = 50):
    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + max_tokens
        chunk = words[start:end]
        chunks.append(" ".join(chunk))
        start = end - overlap  # step back for overlap

    return chunks



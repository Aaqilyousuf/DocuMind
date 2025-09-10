from sentence_transformers import SentenceTransformer

embed_model = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", trust_remote_code=True)


def get_embedding(text: str, task_prefix: str = "search_document") -> list:
    prefixed_text = f"{task_prefix}: {text}"
    return embed_model.encode(prefixed_text).tolist()
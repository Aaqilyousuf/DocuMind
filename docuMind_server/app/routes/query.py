from flask import Blueprint, request, jsonify
from services import embeddings, vectorstore, llm

query_bp = Blueprint("query", __name__)


@query_bp.route("/query", methods=["POST"])
def query_document():
    try:
        data = request.get_json()
        question = data.get("question")
        user_id = data.get("user_id")  # Add user_id from frontend

        if not question:
            return jsonify({"error": "Question is required"}), 400

        # Step 1: Get query embedding
        query_embedding = embeddings.get_embedding(question)

        # Step 2: Query Pinecone with user_id filter
        results = vectorstore.query_documents(
            query_embedding,
            top_k=3,
            user_id=user_id  # Filter by user_id
        )

        if not results:
            return jsonify({
                "answer": "I couldn't find relevant information in the documents.",
                "sources": []
            }), 200

        # Step 3: Extract context and proceed as before
        matches = results
        context = "\n".join([m["metadata"]["text"] for m in matches])
        answer = llm.generate_answer(question, context)

        return jsonify({
            "question": question,
            "answer": answer,
            "sources": [
                {
                    "id": m["id"],
                    "score": m["score"],
                    "source": m["metadata"].get("source", ""),
                    "chunk": m["metadata"].get("chunk_id", ""),
                }
                for m in matches
            ]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
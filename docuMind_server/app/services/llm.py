import os
from groq import Groq

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_answer(question: str, context: str):
    prompt = f"""
    You are a helpful assistant. Use the provided context to answer the question.

    Context:
    {context}

    Question:
    {question}

    Answer:
    """
    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=512,
        temperature=0.7,
    )
    return response.choices[0].message.content
    
# Example usage (assuming GROQ_API_KEY is set in your environment)
# response_text = generate_answer(
#     question="What is a LPU?",
#     context="Groq is a semiconductor company that has developed the LPU, or Language Processing Unit. LPUs are designed for low-latency, high-speed inference for large language models."
# )
# print(response_text)
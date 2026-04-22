import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def analyze_with_llm(text: str):
    try:
        prompt = f"""
You are a cybersecurity assistant.

Analyze the following message or webpage content:

"{text[:2000]}"

Tasks:
1. Classify: Scam / Suspicious / Safe
2. Risk score (0 to 1)
3. Short explanation
4. Highlight risky phrases

Return ONLY JSON:
{{
  "risk": "...",
  "score": 0.0,
  "explanation": "...",
  "highlights": ["..."]
}}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )

        content = response.choices[0].message.content.strip()

        # Try parsing JSON
        data = json.loads(content)

        return {
            "risk": data.get("risk", "Suspicious"),
            "score": float(data.get("score", 0.5)),
            "explanation": data.get("explanation", ""),
            "highlights": data.get("highlights", [])
        }

    except Exception:
        # Fallback if LLM fails
        return {
            "risk": "Suspicious",
            "score": 0.5,
            "explanation": "Could not fully analyze content, marked as suspicious.",
            "highlights": []
        }
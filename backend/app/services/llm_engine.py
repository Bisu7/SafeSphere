import os
import json
from google import genai
from google.genai import types

# Initialize Gemini Client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def analyze_with_llm(text: str):
    try:
        prompt = f"""
You are a cybersecurity assistant.
Analyze the following message or webpage content for scams:

"{text[:2000]}"

Tasks:
1. Classify: Scam / Suspicious / Safe
2. Risk score (0 to 1)
3. Short explanation
4. Highlight risky phrases

Return ONLY a JSON object with this exact structure:
{{
  "risk": "...",
  "score": 0.0,
  "explanation": "...",
  "highlights": ["..."]
}}
"""
        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt
        )
        
        # Extract JSON from response text
        content = response.text.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        data = json.loads(content)

        return {
            "risk": data.get("risk", "Suspicious"),
            "score": float(data.get("score", 0.5)),
            "explanation": data.get("explanation", ""),
            "highlights": data.get("highlights", [])
        }

    except Exception as e:
        print(f"Gemini Text Error: {e}")
        return {
            "risk": "Suspicious",
            "score": 0.5,
            "explanation": "Could not fully analyze content using AI.",
            "highlights": []
        }

def analyze_image_with_llm(image_bytes: bytes):
    try:
        prompt = """
You are a cybersecurity assistant.
Analyze the attached image (screenshot of a message, email, or website) for scams.

Tasks:
1. Extract any text visible in the image.
2. Classify: Scam / Suspicious / Safe
3. Risk score (0 to 1)
4. Short explanation
5. Highlight risky phrases

Return ONLY a JSON object with this exact structure:
{
  "extracted_text": "...",
  "risk": "...",
  "score": 0.0,
  "explanation": "...",
  "highlights": ["..."]
}
"""
        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg'),
                prompt
            ]
        )
        
        content = response.text.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        data = json.loads(content)

        return {
            "extracted_text": data.get("extracted_text", ""),
            "risk": data.get("risk", "Suspicious"),
            "score": float(data.get("score", 0.5)),
            "explanation": data.get("explanation", ""),
            "highlights": data.get("highlights", [])
        }

    except Exception as e:
        print(f"Gemini Image Error: {e}")
        return {
            "extracted_text": "Could not extract text from image.",
            "risk": "Suspicious",
            "score": 0.5,
            "explanation": "Image analysis failed or service is unavailable.",
            "highlights": []
        }
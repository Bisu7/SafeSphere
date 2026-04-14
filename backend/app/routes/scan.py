from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List
import re
import requests
from bs4 import BeautifulSoup

from app.services.rule_engine import analyze_text_rules
from app.services.llm_engine import analyze_with_llm
from app.services.aggregator import aggregate_results

from PIL import Image
import pytesseract
import io

router = APIRouter()

class TextRequest(BaseModel):
    content: str

class UrlRequest(BaseModel):
    url: str


def extract_text_from_image(image_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text from image: {str(e)}")

def fetch_webpage_text(url: str) -> str:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=5)

        if response.status_code != 200:
            return "Failed!"
        
        soup = BeautifulSoup(response.text, "html.parser")

        #remove scripts and styles
        for tag in soup(["scripts","styles"]):
            tag.decompose()

        text = soup.get_text(separator=" ")
        return text.strip()

    except Exception as e:
        return ("Falied to fetch web page content",e)

def analyze_pipeline(content: str):
    if not content or len(content.strip()) == 0:
        raise HTTPException(statues_code=400,detail="Empty content")
    
    rule_result = analyze_text_rules(content)
    llm_result = analyze_with_llm(content)
    final_result = aggregate_results(rule_result,llm_result)

    return final_result

@router.post("/scan/text")
async def scan_text(request: TextRequest):
    return analyze_pipeline(request.content)

@router.post("/scan/url")
async def scan_url(request: UrlRequest):
    url = request.url

    if not url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid URL")

    suspicious_patterns = [
        r"bit\.ly",
        r"tinyurl\.com",
        r"free.*\.ru",
        r"login.*verify",
        r"secure.*account",
    ]

    url_flags = []
    for pattern in suspicious_patterns:
        if re.search(pattern, url):
            url_flags.append(pattern)
         
    # Fetch webpage content
    webpage_text = fetch_webpage_text(url)
    if not webpage_text:
        content = f"User received this suspicious URL: {url}"
    else:
        content = webpage_text[:3000] 
    
    result = analyze_pipeline(content)

    # Step 4: Boost score if URL itself looks suspicious
    if url_flags:
        result["score"] = min(1.0, result["score"] + 0.1)
        result["highlights"].extend(url_flags)

    # Step 5: Add metadata
    result["scanned_url"] = url

    return result

@router.post("/scan/image")
async def scan_image(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    file_bytes = await file.read()

    extracted_text = extract_text_from_image(file_bytes)

    if not extracted_text:
        raise HTTPException(status_code=400, detail="Could not extract text from image")

    result = analyze_pipeline(extracted_text)

    result["extracted_text"] = extracted_text[:500]

    return result
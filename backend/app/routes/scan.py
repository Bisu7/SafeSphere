from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import re
import requests
from bs4 import BeautifulSoup

from app.database import SessionLocal
from app.models.scan import Scan
from app.services.rule_engine import analyze_text_rules
from app.services.llm_engine import analyze_with_llm, analyze_image_with_llm
from app.services.aggregator import aggregate_results

from PIL import Image
import io

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TextRequest(BaseModel):
    content: str

class UrlRequest(BaseModel):
    url: str

class FormRequest(BaseModel):
    domain: str
    fields: List[str]


def fetch_webpage_text(url: str) -> str:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=5)

        if response.status_code != 200:
            return ""
        
        soup = BeautifulSoup(response.text, "html.parser")

        #remove scripts and styles
        for tag in soup(["scripts","styles"]):
            tag.decompose()

        text = soup.get_text(separator=" ")
        return text.strip()

    except Exception as e:
        print(f"Fetch Error: {str(e)}")
        return ""

def analyze_pipeline(content: str):
    if not content or len(content.strip()) == 0:
        raise HTTPException(status_code=400, detail="Empty content")
    
    rule_result = analyze_text_rules(content)
    llm_result = analyze_with_llm(content)
    final_result = aggregate_results(rule_result,llm_result)

    return final_result

@router.post("/extension/analyze-form")
async def analyze_form(request: FormRequest, db: Session = Depends(get_db)):
    # Heuristics for suspicious forms
    suspicious_keywords = ["password", "ssn", "social security", "credit card", "cvv", "otp", "pin"]
    
    found_sensitive = []
    for field in request.fields:
        field_lower = field.lower()
        if any(keyword in field_lower for keyword in suspicious_keywords):
            found_sensitive.append(field)
            
    risk_score = 0.0
    verdict = "Safe"
    
    if found_sensitive:
        risk_score += 0.4
        verdict = "Suspicious"
        
    if len(found_sensitive) > 2:
        risk_score += 0.3
        verdict = "Danger"
        
    # Save to DB
    new_scan = Scan(
        type="form",
        target=request.domain,
        score=risk_score,
        verdict=verdict
    )
    db.add(new_scan)
    db.commit()
    
    return {
        "risk_score": risk_score,
        "verdict": verdict,
        "sensitive_fields": found_sensitive,
        "domain": request.domain
    }

@router.post("/scan/text")
async def scan_text(request: TextRequest, db: Session = Depends(get_db)):
    result = analyze_pipeline(request.content)
    
    # Save to DB
    new_scan = Scan(
        type="text",
        target=request.content[:100],
        score=result.get("score", 0.5),
        verdict=result.get("verdict", "Suspicious")
    )
    db.add(new_scan)
    db.commit()
    
    return result

@router.post("/scan/url")
async def scan_url(request: UrlRequest, db: Session = Depends(get_db)):
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

    # Save to DB
    new_scan = Scan(
        type="url",
        target=url,
        score=result.get("score", 0.5),
        verdict=result.get("verdict", "Suspicious")
    )
    db.add(new_scan)
    db.commit()

    return result

@router.post("/scan/image")
async def scan_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    file_bytes = await file.read()

    # Use AI Vision instead of local Tesseract
    llm_result = analyze_image_with_llm(file_bytes)
    
    # Run local rules on extracted text
    extracted_text = llm_result.get("extracted_text", "")
    rule_result = analyze_text_rules(extracted_text)
    
    # Aggregate results
    final_result = aggregate_results(rule_result, llm_result)
    final_result["extracted_text"] = extracted_text[:500]

    # Save to DB
    new_scan = Scan(
        type="image",
        target=f"Image scan: {file.filename}",
        score=final_result.get("score", 0.5),
        verdict=final_result.get("verdict", "Suspicious")
    )
    db.add(new_scan)
    db.commit()

    return final_result
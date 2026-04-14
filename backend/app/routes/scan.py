from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List
import re
import requests
from bs4 import BeautifulSoup

from app.services.rule_engine import analyze_text_rules
from app.services.llm_engine import analyze_with_llm
from app.services.aggregator import aggregate_results

from PIL import image
import pytesseract
import io

router = APIRouter()

class TextRequest(BaseModel):
    content: str

class UrlRequest(BaseModel):
    url: str



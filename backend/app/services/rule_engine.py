import re
import os
import joblib
from urllib.parse import urlparse
from .train_model import preprocess_text

base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "spam_model.pkl")
domains_path = os.path.join(base_dir, "phishing_domains.txt")

try:
    spam_model = joblib.load(model_path)
except Exception as e:
    print(f"Warning: Failed to load ML model from {model_path}: {e}")
    spam_model = None

phishing_domains = set()
try:
    with open(domains_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    parsed = urlparse(line)
                    domain = parsed.netloc.lower()
                    if domain.startswith("www."):
                        domain = domain[4:]
                    if domain:
                        phishing_domains.add(domain)
                except:
                    pass
except Exception as e:
    print(f"Warning: Failed to load phishing domains: {e}")

SUSPICIOUS_PATTERNS = [
    r"http[s]?://[^\s]+",           # links
    r"\b\d{4}-\d{4}-\d{4}\b",       # fake card format
    r"\bOTP\b",                     # OTP mention
    r"password",                    # password bait
]

def analyze_text_rules(text: str):
    text_lower = text.lower()

    flags = []
    highlights = []
    score = 0.0

    if spam_model:
        try:
            processed = preprocess_text(text)
            probs = spam_model.predict_proba([processed])[0]
            ml_spam_score = float(probs[1])  # cast np.float64 → Python float
            
            score += ml_spam_score * 0.7  
            
            if ml_spam_score > 0.5:
                flags.append("High ML Spam Probability")
        except Exception as e:
            print(f"ML Scoring failed: {e}")
            pass

    for pattern in SUSPICIOUS_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            if "otp" in pattern.lower() or "password" in pattern.lower():
                score += 0.1
                flags.extend(matches)
            highlights.extend(matches)

    found_urls = re.findall(r"http[s]?://[^\s]+", text_lower)
    for url in found_urls:
        try:
            parsed = urlparse(url)
            domain = parsed.netloc
            if domain.startswith("www."):
                domain = domain[4:]
            
            if domain in phishing_domains:
                flags.append(f"Blacklisted domain: {domain}")
                highlights.append(url)
                score += 0.8  
        except:
            pass

    if "urgent" in text_lower or "immediately" in text_lower:
        score += 0.1

    score = min(score, 1.0)

    return {
        "score": round(score, 3),
        "flags": flags,
        "highlights": list(set(highlights))
    }
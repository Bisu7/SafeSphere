import re
import os
import joblib
from urllib.parse import urlparse
from .train_model import preprocess_text

# Load the ML model and phishing domains on startup
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

# Keep a few fundamental regex patterns for highlighting specific entities
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

    # 1. ML Model Prediction
    if spam_model:
        # Predict probability of being spam (class 1)
        # MultinomialNB predict_proba returns [[prob_ham, prob_spam]]
        try:
            processed = preprocess_text(text)
            probs = spam_model.predict_proba([processed])[0]
            ml_spam_score = probs[1]
            
            # Add ML score (weight it appropriately)
            score += ml_spam_score * 0.7  # ML model accounts for up to 70% of the risk
            
            if ml_spam_score > 0.5:
                flags.append("High ML Spam Probability")
        except Exception as e:
            print(f"ML Scoring failed: {e}")
            pass

    # 2. Advanced Regex patterns for specific highlights
    for pattern in SUSPICIOUS_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            # We don't add to score for every regex match if ML is active, 
            # but we use it for highlights. If it's an OTP/Password request, bump score a bit.
            if "otp" in pattern.lower() or "password" in pattern.lower():
                score += 0.1
                flags.extend(matches)
            highlights.extend(matches)

    # 3. Phishing Domain Check
    # Extract URLs from text to check against our DB
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
                score += 0.8  # Known phishing domain is a huge red flag
        except:
            pass

    # 4. Urgency boost
    if "urgent" in text_lower or "immediately" in text_lower:
        score += 0.1

    # Cap score
    score = min(score, 1.0)

    return {
        "score": round(score, 3),
        "flags": flags,
        "highlights": list(set(highlights))
    }
import re

SUSPICIOUS_KEYWORDS = [
    "urgent", "verify now", "click here", "act now",
    "limited time", "account suspended", "login now",
    "confirm your account", "free money", "lottery",
    "win prize", "bank alert", "security alert"
]

SUSPICIOUS_PATTERNS = [
    r"http[s]?://[^\s]+",           # links
    r"\b\d{4}-\d{4}-\d{4}\b",       # fake card format
    r"\bOTP\b",                     # OTP mention
    r"password",                    # password bait
]

BLACKLIST_DOMAINS = [
    "bit.ly", "tinyurl.com", "freegift.ru"
]

def analyze_text_rules(text: str):
    text_lower = text.lower()

    flags = []
    highlights = []
    score = 0.0

    # 1. Keyword detection
    for word in SUSPICIOUS_KEYWORDS:
        if word in text_lower:
            flags.append(word)
            highlights.append(word)
            score += 0.08

    # 2. Regex patterns
    for pattern in SUSPICIOUS_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            flags.extend(matches)
            highlights.extend(matches)
            score += 0.1

    # 3. Blacklisted domains
    for domain in BLACKLIST_DOMAINS:
        if domain in text_lower:
            flags.append(domain)
            highlights.append(domain)
            score += 0.2

    # 4. Urgency boost
    if "urgent" in text_lower or "immediately" in text_lower:
        score += 0.1

    # Cap score
    score = min(score, 1.0)

    return {
        "score": score,
        "flags": flags,
        "highlights": list(set(highlights))
    }
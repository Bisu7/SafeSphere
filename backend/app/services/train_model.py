import pandas as pd
import requests
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import os
import re

# Download NLTK data (silent if already downloaded)
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
# Also download punkt_tab if needed for newer nltk versions
try:
    nltk.download('punkt_tab', quiet=True)
except:
    pass

stemmer = PorterStemmer()
try:
    stop_words = set(stopwords.words('english'))
except:
    stop_words = set()

def preprocess_text(text: str) -> str:
    """Preprocess text: lowercasing, punctuation removal, stopword removal, and stemming."""
    text = text.lower()
    # Remove punctuation
    text = "".join([char for char in text if char not in string.punctuation])
    # Tokenize
    tokens = nltk.word_tokenize(text)
    # Remove stopwords and stem
    processed_tokens = [stemmer.stem(word) for word in tokens if word not in stop_words]
    return " ".join(processed_tokens)

def download_phishing_domains(output_path: str):
    print("Downloading Phishing Domains from OpenPhish...")
    try:
        url = "https://openphish.com/feed.txt"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(response.text)
        print(f"Saved {len(response.text.splitlines())} domains.")
    except Exception as e:
        print(f"Failed to download from OpenPhish: {e}. Trying fallback...")
        try:
            url = "https://raw.githubusercontent.com/mitchellkrogza/Phishing.Database/master/phishing-domains-ACTIVE.txt"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(response.text)
            print(f"Saved {len(response.text.splitlines())} domains from fallback.")
        except Exception as e2:
            print(f"Fallback also failed: {e2}")

def train_and_save_model(model_path: str):
    print("Downloading Kaggle SMS Spam Collection...")
    url = "https://raw.githubusercontent.com/justmarkham/pycon-2016-tutorial/master/data/sms.tsv"
    
    # Read TSV directly into Pandas
    df = pd.read_csv(url, sep='\t', header=None, names=['label', 'message'])
    print(f"Loaded {len(df)} records. Training ML model...")

    # Preprocess messages
    df['processed_message'] = df['message'].apply(preprocess_text)

    # Prepare labels (spam = 1, ham = 0)
    y = df['label'].map({'spam': 1, 'ham': 0})
    X = df['processed_message']

    # Create ML pipeline
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=3000)),
        ('nb', MultinomialNB())
    ])

    # Train model
    pipeline.fit(X, y)
    print("Model training complete.")

    # Save model
    joblib.dump(pipeline, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "spam_model.pkl")
    domains_path = os.path.join(base_dir, "phishing_domains.txt")
    
    download_phishing_domains(domains_path)
    train_and_save_model(model_path)
    print("Data preparation and model training finished successfully.")

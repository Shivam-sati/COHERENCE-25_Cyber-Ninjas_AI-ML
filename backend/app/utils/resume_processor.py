import numpy as np
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pdfplumber
import nltk
import string
import os
from nltk.corpus import stopwords
import joblib
import docx2txt
from typing import List, Dict, Any
from datetime import datetime

# Download required NLTK data
nltk.download("stopwords")
stop_words = set(stopwords.words("english"))

class ResumeProcessor:
    def __init__(self, root_path: str):
        self.root_path = root_path
        self.clf = joblib.load(os.path.join(root_path, 'clf.pkl'))
        self.tfidf = joblib.load(os.path.join(root_path, 'tfidf.pkl'))
        self.encoder = joblib.load(os.path.join(root_path, 'encoder.pkl'))
        self.analysis_history = []

    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from a PDF resume."""
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text

    def extract_text_from_docx(self, docx_path: str) -> str:
        """Extract text from a DOCX resume."""
        return docx2txt.process(docx_path)

    def extract_resume_text(self, file_path: str) -> str:
        """Detect file type and extract text accordingly."""
        if file_path.endswith(".pdf"):
            return self.extract_text_from_pdf(file_path)
        elif file_path.endswith(".docx"):
            return self.extract_text_from_docx(file_path)
        else:
            raise ValueError("Unsupported file format. Use PDF or DOCX.")

    def preprocess_text(self, text: str) -> str:
        """Preprocess text for analysis."""
        text = text.lower()
        text = text.translate(str.maketrans("", "", string.punctuation))
        words = text.split()
        words = [word for word in words if word not in stop_words]
        return " ".join(words)

    def extract_email(self, text: str) -> str:
        """Extract email from text."""
        email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        emails = re.findall(email_regex, text)
        if emails:
            for email in emails:
                if email.endswith('example.com'):
                    return email
            return emails[0]
        return None

    def extract_phone_number(self, text: str) -> str:
        """Extract phone number from text."""
        phone_regex = r'(\+?\d{1,3}[-\s]?)?(\d{10})'
        phones = re.findall(phone_regex, text)
        if phones:
            return phones[0][1]
        return None

    def predict_category(self, text: str) -> str:
        """Predict resume category."""
        cleaned_text = self.preprocess_text(text)
        vectorized_text = self.tfidf.transform([text])
        vectorized_text = vectorized_text.toarray()
        predicted_category = self.clf.predict(vectorized_text)
        return self.encoder.inverse_transform(predicted_category)[0]

    def calculate_similarity(self, resume_texts: List[str], job_desc: str) -> pd.Series:
        """Calculate similarity scores between resumes and job description."""
        vectorizer = TfidfVectorizer(stop_words='english')
        pre_job_desc = self.preprocess_text(job_desc)
        vectors = vectorizer.fit_transform([pre_job_desc] + resume_texts)
        job_vector = vectors[0]
        resume_vectors = vectors[1:]
        similarity_scores = cosine_similarity(job_vector, resume_vectors)[0]
        return pd.Series(similarity_scores).pow(0.25)

    def process_resumes(self, resume_files: List[str], job_description: str, limit: int = 15) -> Dict[str, Any]:
        """Process multiple resumes and return analysis results."""
        # Extract text from resumes
        resume_texts = []
        for file_path in resume_files:
            try:
                text = self.extract_resume_text(file_path)
                resume_texts.append(text)
            except Exception as e:
                print(f"Error processing {file_path}: {str(e)}")
                continue

        # Create DataFrame
        df = pd.DataFrame({
            'extracted': resume_texts,
            'filename': [os.path.basename(f) for f in resume_files]
        })

        # Preprocess and extract information
        df['preprocessed'] = df['extracted'].apply(self.preprocess_text)
        df['email'] = df['extracted'].apply(self.extract_email)
        df['phone'] = df['extracted'].apply(self.extract_phone_number)
        df['category'] = df['extracted'].apply(self.predict_category)

        # Calculate similarity scores
        df['score'] = round(self.calculate_similarity(list(df['extracted']), job_description) * 100)

        # Get top candidates
        top_candidates = df.sort_values(by='score', ascending=False).reset_index(drop=True)[:limit]

        # Prepare results
        results = {
            'timestamp': datetime.now().isoformat(),
            'job_description': job_description,
            'total_resumes': len(resume_files),
            'processed_resumes': len(resume_texts),
            'candidates': top_candidates.to_dict('records')
        }

        # Store in memory
        self.analysis_history.append(results)

        return results

    def get_analysis_history(self) -> List[Dict[str, Any]]:
        """Get all analysis history"""
        return self.analysis_history

    def get_top_candidates(self, limit: int) -> List[Dict[str, Any]]:
        """Get top candidates from all analyses"""
        all_candidates = []
        for analysis in self.analysis_history:
            for candidate in analysis['candidates']:
                candidate['timestamp'] = analysis['timestamp']
                candidate['job_description'] = analysis['job_description']
                all_candidates.append(candidate)
        
        # Sort by score and get top N
        return sorted(all_candidates, key=lambda x: x['score'], reverse=True)[:limit] 
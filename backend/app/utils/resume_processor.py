import numpy as np
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pdfplumber
import nltk
import string
import os
import json
from nltk.corpus import stopwords
import joblib
import docx2txt
from typing import List, Dict, Any
from datetime import datetime

# Download required NLTK data with error handling
try:
    nltk.download("stopwords", quiet=True)
    stop_words = set(stopwords.words("english"))
except Exception as e:
    print(f"Warning: Could not download NLTK stopwords: {str(e)}")
    # Fallback to a basic set of stopwords if download fails
    stop_words = set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
                      'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 
                      'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 
                      'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
                      'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
                      'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
                      'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 
                      'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
                      'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
                      'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 
                      'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 
                      'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 
                      'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 
                      't', 'can', 'will', 'just', 'don', 'should', 'now'])

class ResumeProcessor:
    def __init__(self, root_path: str):
        self.root_path = root_path
        self.history_file = os.path.join(root_path, 'backend/app/data/data.json')
        
        # Load models with error handling
        try:
            self.clf = joblib.load(os.path.join(root_path, 'clf.pkl'))
            self.tfidf = joblib.load(os.path.join(root_path, 'tfidf.pkl'))
            self.encoder = joblib.load(os.path.join(root_path, 'encoder.pkl'))
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            # Initialize with default values if models can't be loaded
            self.clf = None
            self.tfidf = None
            self.encoder = None
        
        # Load analysis history from file if it exists
        self.analysis_history = self.load_analysis_history()
    
    def load_analysis_history(self) -> List[Dict[str, Any]]:
        """Load analysis history from file if it exists"""
        try:
            if os.path.exists(self.history_file):
                with open(self.history_file, 'r') as f:
                    return json.load(f)
            return []
        except Exception as e:
            print(f"Error loading analysis history: {str(e)}")
            return []
    
    def save_analysis_history(self):
        """Save analysis history to file"""
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(self.history_file), exist_ok=True)
            
            with open(self.history_file, 'w') as f:
                json.dump(self.analysis_history, f)
        except Exception as e:
            print(f"Error saving analysis history: {str(e)}")
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from a PDF resume."""
        try:
            text = ""
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
            
            # If pdfplumber didn't extract any text, try an alternative method
            if not text.strip():
                from PyPDF2 import PdfReader
                reader = PdfReader(pdf_path)
                text = ""
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
            
            return text
        except Exception as e:
            print(f"Error extracting text from PDF {pdf_path}: {str(e)}")
            return ""

    def extract_text_from_docx(self, docx_path: str) -> str:
        """Extract text from a DOCX resume."""
        try:
            return docx2txt.process(docx_path)
        except Exception as e:
            print(f"Error extracting text from DOCX {docx_path}: {str(e)}")
            return ""

    def extract_text_from_txt(self, txt_path: str) -> str:
        """Extract text from a TXT file."""
        try:
            with open(txt_path, 'r', encoding='utf-8') as f:
                return f.read()
        except UnicodeDecodeError:
            # Try with a different encoding if utf-8 fails
            with open(txt_path, 'r', encoding='latin-1') as f:
                return f.read()
        except Exception as e:
            print(f"Error extracting text from TXT {txt_path}: {str(e)}")
            return ""

    def extract_resume_text(self, file_path: str) -> str:
        """Detect file type and extract text accordingly."""
        try:
            if file_path.lower().endswith(".pdf"):
                return self.extract_text_from_pdf(file_path)
            elif file_path.lower().endswith((".docx", ".doc")):
                return self.extract_text_from_docx(file_path)
            elif file_path.lower().endswith(".txt"):
                return self.extract_text_from_txt(file_path)
            else:
                print(f"Unsupported file format for {file_path}. Use PDF, DOCX, or TXT.")
                return ""
        except Exception as e:
            print(f"Error processing file {file_path}: {str(e)}")
            return ""

    def preprocess_text(self, text: str) -> str:
        """Preprocess text for analysis."""
        if not text:
            return ""
            
        # Convert to lowercase
        text = text.lower()
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove punctuation but preserve important characters for emails and URLs
        text = text.translate(str.maketrans("", "", string.punctuation.replace('@', '').replace('.', '').replace('-', '')))
        
        # Remove stopwords
        words = text.split()
        words = [word for word in words if word not in stop_words]
        
        return " ".join(words)

    def extract_email(self, text: str) -> str:
        """Extract email from text."""
        if not text:
            return None
            
        email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        emails = re.findall(email_regex, text)
        if emails:
            # Filter out example emails
            real_emails = [email for email in emails if not ('example' in email.lower() or 'test' in email.lower())]
            if real_emails:
                return real_emails[0]
            return emails[0]
        return None

    def extract_phone_number(self, text: str) -> str:
        """Extract phone number from text."""
        if not text:
            return None
            
        # More comprehensive phone regex
        phone_regex = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_regex, text)
        if phones:
            return phones[0]
        return None

    def predict_category(self, text: str) -> str:
        """Predict resume category."""
        if not text or not self.clf or not self.tfidf or not self.encoder:
            return "Unknown"
            
        try:
            cleaned_text = self.preprocess_text(text)
            vectorized_text = self.tfidf.transform([cleaned_text])
            vectorized_text = vectorized_text.toarray()
            predicted_category = self.clf.predict(vectorized_text)
            return self.encoder.inverse_transform(predicted_category)[0]
        except Exception as e:
            print(f"Error predicting category: {str(e)}")
            return "Unknown"

    def calculate_similarity(self, resume_texts: List[str], job_desc: str) -> pd.Series:
        """Calculate similarity scores between resumes and job description."""
        if not resume_texts or not job_desc:
            return pd.Series([0] * len(resume_texts))
            
        try:
            vectorizer = TfidfVectorizer(stop_words='english')
            pre_job_desc = self.preprocess_text(job_desc)
            
            # Handle case of empty texts
            processed_texts = [self.preprocess_text(text) if text else "" for text in resume_texts]
            non_empty_texts = [text for text in processed_texts if text]
            
            if not non_empty_texts:
                return pd.Series([0] * len(resume_texts))
                
            vectors = vectorizer.fit_transform([pre_job_desc] + non_empty_texts)
            job_vector = vectors[0]
            resume_vectors = vectors[1:]
            
            similarity_scores = cosine_similarity(job_vector, resume_vectors)[0]
            
            # Map scores back to original indices
            result = []
            score_idx = 0
            
            for text in processed_texts:
                if text:
                    if score_idx < len(similarity_scores):
                        result.append(similarity_scores[score_idx])
                        score_idx += 1
                    else:
                        result.append(0)
                else:
                    result.append(0)
                    
            return pd.Series(result).pow(0.25)  # Apply power transformation to normalize scores
        except Exception as e:
            print(f"Error calculating similarity: {str(e)}")
            return pd.Series([0] * len(resume_texts))

    def process_resumes(self, resume_files: List[str], job_description: str, limit: int = 15) -> Dict[str, Any]:
        """Process multiple resumes and return analysis results."""
        # Extract text from resumes
        resume_texts = []
        processed_files = []
        
        for file_path in resume_files:
            try:
                text = self.extract_resume_text(file_path)
                if text.strip():  # Only include non-empty texts
                    resume_texts.append(text)
                    processed_files.append(file_path)
                else:
                    print(f"No text extracted from {file_path}")
            except Exception as e:
                print(f"Error processing {file_path}: {str(e)}")
                continue

        if not resume_texts:
            return {
                'timestamp': datetime.now().isoformat(),
                'job_description': job_description,
                'total_resumes': len(resume_files),
                'processed_resumes': 0,
                'candidates': [],
                'error': 'No text could be extracted from the provided resumes'
            }

        # Create DataFrame
        df = pd.DataFrame({
            'extracted': resume_texts,
            'filename': [os.path.basename(f) for f in processed_files]
        })

        # Preprocess and extract information
        df['preprocessed'] = df['extracted'].apply(self.preprocess_text)
        df['email'] = df['extracted'].apply(self.extract_email)
        df['phone'] = df['extracted'].apply(self.extract_phone_number)
        df['category'] = df['extracted'].apply(self.predict_category)

        # Calculate similarity scores
        similarity_scores = self.calculate_similarity(list(df['extracted']), job_description)
        df['score'] = round(similarity_scores * 100)

        # Get top candidates
        top_candidates = df.sort_values(by='score', ascending=False).reset_index(drop=True)
        
        # Apply limit only if there are enough candidates
        if limit and len(top_candidates) > limit:
            top_candidates = top_candidates[:limit]

        # Prepare results
        results = {
            'timestamp': datetime.now().isoformat(),
            'job_description': job_description,
            'total_resumes': len(resume_files),
            'processed_resumes': len(resume_texts),
            'candidates': top_candidates.to_dict('records')
        }

        # Store in memory and persistent storage
        self.analysis_history.append(results)
        self.save_analysis_history()

        return results

    def get_analysis_history(self) -> List[Dict[str, Any]]:
        """Get all analysis history"""
        return self.analysis_history

    def get_top_candidates(self, limit: int) -> List[Dict[str, Any]]:
        """Get top candidates from all analyses"""
        all_candidates = []
        
        for analysis in self.analysis_history:
            if 'candidates' in analysis:
                for candidate in analysis['candidates']:
                    candidate_copy = candidate.copy()
                    candidate_copy['timestamp'] = analysis['timestamp']
                    candidate_copy['job_description'] = analysis['job_description']
                    all_candidates.append(candidate_copy)
        
        # Sort by score and get top N
        if not all_candidates:
            return []
            
        # Handle the case where 'score' might be missing
        all_candidates_with_scores = [c for c in all_candidates if 'score' in c]
        if not all_candidates_with_scores:
            return all_candidates[:limit] if limit and len(all_candidates) > limit else all_candidates
            
        top_candidates = sorted(all_candidates_with_scores, key=lambda x: x['score'], reverse=True)
        
        return top_candidates[:limit] if limit and len(top_candidates) > limit else top_candidates
import random
import re
from typing import Dict, List, Any

class MockAIModel:
    def __init__(self):
        # Expanded skills list categorized by domain
        self.skills_by_category = {
            "frontend": [
                "JavaScript", "TypeScript", "React", "Angular", "Vue.js", 
                "HTML", "CSS", "SASS", "LESS", "Redux", "Webpack", "Babel",
                "Next.js", "Gatsby", "Material UI", "Tailwind CSS"
            ],
            "backend": [
                "Node.js", "Express", "Django", "Flask", "Spring Boot", 
                "Ruby on Rails", "ASP.NET", "Laravel", "FastAPI", "GraphQL",
                "REST API", "Microservices", "Serverless"
            ],
            "database": [
                "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra",
                "DynamoDB", "Firebase", "Oracle", "SQLite", "Elasticsearch"
            ],
            "devops": [
                "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", 
                "CircleCI", "GitHub Actions", "Terraform", "Ansible", "Prometheus",
                "Grafana", "ELK Stack", "Git", "CI/CD"
            ],
            "data_science": [
                "Python", "R", "Machine Learning", "Deep Learning", "TensorFlow", 
                "PyTorch", "Pandas", "NumPy", "Scikit-learn", "Data Analysis",
                "Data Visualization", "NLP", "Computer Vision", "Big Data"
            ],
            "soft_skills": [
                "Communication", "Leadership", "Teamwork", "Problem Solving", 
                "Critical Thinking", "Time Management", "Adaptability", "Creativity",
                "Project Management", "Agile", "Scrum"
            ]
        }
        
        # Flatten skills list for easy access
        self.skills = []
        for category in self.skills_by_category.values():
            self.skills.extend(category)
        
        self.sentiments = ["positive", "neutral", "negative"]
        
    def analyze_resume(self, text: str) -> Dict[str, Any]:
        """Mock resume analysis"""
        return {
            "name": "John Doe",  # This would be extracted from the resume
            "email": "john.doe@example.com",
            "phone": "+1 (555) 123-4567",
            "experience": [
                {
                    "company": "Tech Corp",
                    "position": "Senior Software Engineer",
                    "duration": "2020-2023",
                    "description": "Led development of cloud-native applications"
                }
            ],
            "education": [
                {
                    "institution": "University of Technology",
                    "degree": "Bachelor of Computer Science",
                    "year": "2019"
                }
            ]
        }
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from resume text"""
        if not text:
            return []
        
        # In a real implementation, this would use NLP to extract skills
        # For our mock implementation, we'll extract skills that appear in the text
        extracted_skills = []
        
        # If text is provided, look for actual skills in the text
        if text:
            text_lower = text.lower()
            for skill in self.skills:
                # Use word boundary to avoid partial matches
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    extracted_skills.append(skill)
        
        # If we didn't find any skills or text is empty, generate random skills
        if not extracted_skills:
            # Generate a random set of skills
            num_skills = random.randint(5, 12)
            extracted_skills = random.sample(self.skills, num_skills)
            
            # Ensure we have a mix of different skill categories
            if len(extracted_skills) < 5:
                for category in random.sample(list(self.skills_by_category.keys()), 3):
                    if self.skills_by_category[category]:
                        skill = random.choice(self.skills_by_category[category])
                        if skill not in extracted_skills:
                            extracted_skills.append(skill)
        
        return extracted_skills
    
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of resume text"""
        # In a real implementation, this would use NLP for sentiment analysis
        # For our mock implementation, we'll generate a realistic sentiment score
        
        # Default to neutral with medium confidence
        sentiment = "neutral"
        score = 0.5
        
        # If text is provided, do some basic analysis
        if text:
            text_lower = text.lower()
            
            # Look for positive keywords
            positive_keywords = ["accomplished", "achieved", "improved", "increased", 
                               "developed", "led", "managed", "created", "successful",
                               "award", "recognition", "promoted", "excellence"]
            
            # Look for negative keywords
            negative_keywords = ["failed", "mistake", "error", "problem", "difficulty",
                               "challenge", "struggle", "terminated", "fired", "left"]
            
            # Count occurrences
            positive_count = sum(1 for word in positive_keywords if word in text_lower)
            negative_count = sum(1 for word in negative_keywords if word in text_lower)
            
            # Calculate sentiment score (0 to 1)
            total = positive_count + negative_count
            if total > 0:
                score = positive_count / total
            
            # Determine sentiment label
            if score >= 0.7:
                sentiment = "positive"
            elif score <= 0.3:
                sentiment = "negative"
            else:
                sentiment = "neutral"
        else:
            # Generate random sentiment if no text
            sentiment = random.choice(self.sentiments)
            score = random.uniform(0.3, 0.9)
            if sentiment == "positive":
                score = random.uniform(0.7, 0.95)
            elif sentiment == "negative":
                score = random.uniform(0.05, 0.3)
            else:
                score = random.uniform(0.4, 0.6)
        
        return {
            "label": sentiment,
            "score": round(score, 2),
            "key_phrases": self._generate_key_phrases(sentiment)
        }
    
    def _generate_key_phrases(self, sentiment: str) -> List[str]:
        """Generate key phrases based on sentiment"""
        phrases = {
            "positive": [
                "strong technical background", "excellent communication skills",
                "proven track record", "innovative problem solver", 
                "dedicated team player", "results-oriented professional"
            ],
            "neutral": [
                "experienced professional", "technical background",
                "team contributor", "detail-oriented", 
                "analytical thinker", "continuous learner"
            ],
            "negative": [
                "limited experience", "basic understanding",
                "developing skills", "needs improvement",
                "seeking opportunities", "transitioning professional"
            ]
        }
        
        # Select 2-4 random phrases from the appropriate list
        num_phrases = random.randint(2, 4)
        return random.sample(phrases.get(sentiment, phrases["neutral"]), num_phrases)
    
    def analyze_candidate(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mock candidate analysis"""
        return {
            "overall_score": round(random.uniform(70, 95), 2),
            "strengths": [
                "Strong technical background",
                "Good communication skills",
                "Team leadership experience"
            ],
            "areas_for_improvement": [
                "Could benefit from more cloud experience",
                "Consider adding more certifications"
            ],
            "recommendations": [
                "Consider AWS certification",
                "Focus on microservices architecture"
            ],
            "cultural_fit": round(random.uniform(0.7, 0.95), 2)
        }
import random
from typing import Dict, List, Any

class MockAIModel:
    def __init__(self):
        self.skills = [
            "Python", "JavaScript", "React", "Node.js", "Flask", "Django",
            "SQL", "MongoDB", "AWS", "Docker", "Kubernetes", "Git",
            "Machine Learning", "Data Analysis", "Project Management"
        ]
        
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
        """Mock skills extraction"""
        return random.sample(self.skills, random.randint(3, 8))
    
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Mock sentiment analysis"""
        sentiment = random.choice(self.sentiments)
        confidence = round(random.uniform(0.6, 0.95), 2)
        return {
            "sentiment": sentiment,
            "confidence": confidence,
            "key_phrases": ["experienced", "motivated", "team player"]
        }
    
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
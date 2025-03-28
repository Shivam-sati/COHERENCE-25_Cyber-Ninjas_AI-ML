import re
import os
import json
from collections import Counter
from flask import current_app
from typing import List, Dict, Any

class ResumeAnalyzer:
    def __init__(self):
        self.logger = current_app.logger
        # Load skills dictionary from JSON file
        self.skills_file = self.get_skills_file()
        self.skills_dict = self._load_skills_dict()
        
        # Common skill categories
        self.skill_categories = {
            'programming_languages': ['python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'go', 'php', 'swift', 'kotlin'],
            'web_technologies': ['html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring'],
            'databases': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'firebase', 'dynamodb', 'cassandra'],
            'cloud_platforms': ['aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'kubernetes', 'docker'],
            'data_science': ['machine learning', 'deep learning', 'nlp', 'data analysis', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn'],
            'soft_skills': ['communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking', 'time management', 'adaptability']
        }
    
    def get_skills_file(self):
        return os.path.join(current_app.root_path, 'data', 'skills.json')
    
    def _load_skills_dict(self):
        """Load skills dictionary from JSON file or create if it doesn't exist"""
        try:
            if os.path.exists(self.skills_file):
                with open(self.skills_file, 'r') as f:
                    return json.load(f)
            else:
                # Create a basic skills dictionary if it doesn't exist
                skills_dict = {
                    "technical": [
                        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Ruby", "Go", "PHP", "Swift",
                        "HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask", "Spring",
                        "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "Firebase", "DynamoDB", "Cassandra",
                        "AWS", "Azure", "GCP", "Heroku", "DigitalOcean", "Kubernetes", "Docker", "CI/CD", "Git", "GitHub",
                        "Machine Learning", "Deep Learning", "NLP", "Data Analysis", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn",
                        "REST API", "GraphQL", "Microservices", "Serverless", "DevOps", "Agile", "Scrum", "Kanban", "JIRA", "Confluence"
                    ],
                    "soft": [
                        "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management", "Adaptability",
                        "Creativity", "Emotional Intelligence", "Conflict Resolution", "Decision Making", "Negotiation", "Presentation", "Mentoring"
                    ],
                    "domain": [
                        "Healthcare", "Finance", "E-commerce", "Education", "Real Estate", "Manufacturing", "Retail", "Logistics", "Marketing",
                        "Sales", "Customer Service", "Human Resources", "Legal", "Accounting", "Project Management", "Product Management"
                    ]
                }
                
                # Ensure the data directory exists
                os.makedirs(os.path.dirname(self.skills_file), exist_ok=True)
                
                # Save skills dictionary
                with open(self.skills_file, 'w') as f:
                    json.dump(skills_dict, f)
                
                return skills_dict
        except Exception as e:
            self.logger.error(f"Error loading skills dictionary: {str(e)}")
            return {
                "technical": [],
                "soft": [],
                "domain": []
            }
    
    def load_skills(self) -> List[str]:
        """Load predefined skills from JSON file"""
        try:
            skills_file = self.get_skills_file()
            if not os.path.exists(skills_file):
                return []
            
            with open(skills_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            self.logger.error(f"Error loading skills: {str(e)}")
            return []
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from resume text"""
        try:
            # Load predefined skills
            predefined_skills = self.load_skills()
            
            # Convert text to lowercase for case-insensitive matching
            text = text.lower()
            
            # Find matches for predefined skills
            found_skills = []
            for skill in predefined_skills:
                if skill.lower() in text:
                    found_skills.append(skill)
            
            return found_skills
            
        except Exception as e:
            self.logger.error(f"Error extracting skills: {str(e)}")
            return []
    
    def categorize_skills(self, skills):
        """Categorize skills into technical, soft, and domain skills"""
        categorized = {
            "technical": [],
            "soft": [],
            "domain": []
        }
        
        for skill in skills:
            for category, category_skills in self.skills_dict.items():
                if skill in category_skills:
                    categorized[category].append(skill)
                    break
        
        return categorized
    
    def compute_skill_stats(self, text):
        """Compute statistics about skills in the resume"""
        if not text:
            return {}
        
        # Extract skills
        skills = self.extract_skills(text)
        
        # Count skill occurrences
        skill_counts = Counter(skills)
        
        # Categorize skills
        categorized_skills = self.categorize_skills(skills)
        
        # Calculate category percentages
        total_skills = len(skills)
        category_percentages = {}
        for category, category_skills in categorized_skills.items():
            if total_skills > 0:
                category_percentages[category] = round((len(category_skills) / total_skills) * 100, 2)
            else:
                category_percentages[category] = 0
        
        # Get top skills by frequency
        top_skills = [skill for skill, count in skill_counts.most_common(10)]
        
        # Calculate skill proficiency (in a real app, this would use more sophisticated analysis)
        skill_proficiency = {}
        for skill in skills:
            # Mock proficiency level based on frequency
            count = skill_counts[skill]
            if count >= 3:
                proficiency = "Expert"
            elif count >= 2:
                proficiency = "Intermediate"
            else:
                proficiency = "Beginner"
            skill_proficiency[skill] = proficiency
        
        # Analyze skill distribution by category
        skill_distribution = {}
        for category_name, category_keywords in self.skill_categories.items():
            matches = []
            for keyword in category_keywords:
                if keyword in text.lower():
                    matches.append(keyword)
            if matches:
                skill_distribution[category_name] = len(matches)
        
        # Return statistics
        return {
            "totalSkills": total_skills,
            "uniqueSkills": len(skill_counts),
            "topSkills": top_skills,
            "skillFrequency": dict(skill_counts),
            "categorizedSkills": categorized_skills,
            "categoryPercentages": category_percentages,
            "skillProficiency": skill_proficiency,
            "skillDistribution": skill_distribution
        }
    
    def analyze_resume(self, text: str) -> Dict[str, Any]:
        """Analyze resume text and extract relevant information"""
        try:
            # Extract skills
            skills = self.extract_skills(text)
            
            # Basic analysis results
            analysis = {
                'skills': skills,
                'skill_count': len(skills),
                'word_count': len(text.split()),
                'char_count': len(text)
            }
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Error analyzing resume: {str(e)}")
            return {
                'error': 'Failed to analyze resume',
                'details': str(e)
            }

import re
import os
import json
from collections import Counter
from flask import current_app

class ResumeAnalyzer:
    def __init__(self):
        # Load skills dictionary from JSON file
        self.skills_file = os.path.join(current_app.root_path, 'data', 'skills.json')
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
            current_app.logger.error(f"Error loading skills dictionary: {str(e)}")
            return {
                "technical": [],
                "soft": [],
                "domain": []
            }
    
    def extract_skills(self, text):
        """Extract skills from resume text"""
        if not text:
            return []
        
        # Normalize text
        text = text.lower()
        
        # Flatten skills dictionary
        all_skills = []
        for category in self.skills_dict.values():
            all_skills.extend(category)
        
        # Extract skills
        found_skills = []
        for skill in all_skills:
            skill_pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(skill_pattern, text):
                found_skills.append(skill)
        
        return found_skills
    
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
    
    def analyze_resume(self, text):
        """Analyze resume text and extract various insights"""
        if not text:
            return {}
        
        # Extract skills and compute statistics
        skill_stats = self.compute_skill_stats(text)
        
        # Calculate word count
        words = re.findall(r'\b\w+\b', text)
        word_count = len(words)
        
        # Calculate sentence count
        sentences = re.split(r'[.!?]+', text)
        sentence_count = sum(1 for s in sentences if s.strip())
        
        # Calculate average sentence length
        if sentence_count > 0:
            avg_sentence_length = word_count / sentence_count
        else:
            avg_sentence_length = 0
        
        # Extract education (simple regex pattern)
        education_patterns = [
            r'(?i)(?:B\.?S\.?|Bachelor of Science|Bachelor\'s) (?:in|of)? (?:[A-Za-z\s]+)',
            r'(?i)(?:M\.?S\.?|Master of Science|Master\'s) (?:in|of)? (?:[A-Za-z\s]+)',
            r'(?i)(?:Ph\.?D\.?|Doctor of Philosophy|Doctorate) (?:in|of)? (?:[A-Za-z\s]+)',
            r'(?i)(?:MBA|Master of Business Administration)',
            r'(?i)University of [A-Za-z\s]+',
            r'(?i)[A-Za-z]+ University',
            r'(?i)[A-Za-z]+ College',
            r'(?i)[A-Za-z]+ Institute of [A-Za-z\s]+'
        ]
        
        education = []
        for pattern in education_patterns:
            matches = re.findall(pattern, text)
            education.extend(matches)
        
        # Extract experience (years)
        experience_patterns = [
            r'(?i)(\d+)[\+]? years? of experience',
            r'(?i)experience of (\d+)[\+]? years?',
            r'(?i)(\d+)[\+]? years? experience'
        ]
        
        experience_years = []
        for pattern in experience_patterns:
            matches = re.findall(pattern, text)
            experience_years.extend(matches)
        
        if experience_years:
            try:
                years_of_experience = max(int(year) for year in experience_years)
            except ValueError:
                years_of_experience = None
        else:
            years_of_experience = None
        
        # Return analysis results
        return {
            "skills": skill_stats,
            "wordCount": word_count,
            "sentenceCount": sentence_count,
            "avgSentenceLength": round(avg_sentence_length, 2),
            "education": list(set(education)),
            "yearsOfExperience": years_of_experience
        }

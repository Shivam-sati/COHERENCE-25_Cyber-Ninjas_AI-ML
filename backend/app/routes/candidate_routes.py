from flask import Blueprint, request, jsonify, current_app
import os
import json
from datetime import datetime
from app.utils.mock_ai import MockAIModel

bp = Blueprint('candidate', __name__, url_prefix='/api/candidates')
mock_ai = MockAIModel()

# Mock database - in a real application, this would be a database connection
CANDIDATES_FILE = os.path.join(current_app.root_path, 'data', 'candidates.json')

def get_all_candidates():
    """Get all candidates from the mock database"""
    try:
        if os.path.exists(CANDIDATES_FILE):
            with open(CANDIDATES_FILE, 'r') as f:
                return json.load(f)
        else:
            # Create mock data if file doesn't exist
            candidates = [
                {
                    "id": f"c{i}",
                    "name": f"Candidate {i}",
                    "email": f"candidate{i}@example.com",
                    "role": "Software Developer" if i % 3 == 0 else "UX Designer" if i % 3 == 1 else "Product Manager",
                    "matchScore": 90 - (i % 20),
                    "skills": ["JavaScript", "React", "Node.js"] if i % 3 == 0 else ["Figma", "UI/UX", "Wireframing"] if i % 3 == 1 else ["Agile", "Product Strategy", "User Research"],
                    "topSkill": "JavaScript (4 years)" if i % 3 == 0 else "Figma (3 years)" if i % 3 == 1 else "Agile (5 years)",
                    "resumeId": f"resume{i}",
                    "appliedDate": (datetime.now().isoformat())
                }
                for i in range(1, 31)  # Create 30 mock candidates
            ]
            
            # Ensure the data directory exists
            os.makedirs(os.path.dirname(CANDIDATES_FILE), exist_ok=True)
            
            # Save mock data
            with open(CANDIDATES_FILE, 'w') as f:
                json.dump(candidates, f)
            
            return candidates
    except Exception as e:
        current_app.logger.error(f"Error getting candidates: {str(e)}")
        return []

@bp.route('/', methods=['GET'])
def get_candidates():
    """Get paginated list of candidates with filtering options"""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        search = request.args.get('search', '')
        role_filter = request.args.get('role', 'all')
        sort_by = request.args.get('sortBy', 'matchScore')
        sort_order = request.args.get('sortOrder', 'desc')
        
        # Get all candidates
        all_candidates = get_all_candidates()
        
        # Filter candidates
        filtered_candidates = all_candidates
        
        # Apply search filter
        if search:
            search = search.lower()
            filtered_candidates = [
                c for c in filtered_candidates if 
                search in c['name'].lower() or 
                search in c['email'].lower() or 
                search in c['role'].lower() or
                any(search in skill.lower() for skill in c['skills'])
            ]
        
        # Apply role filter
        if role_filter != 'all':
            filtered_candidates = [
                c for c in filtered_candidates if 
                role_filter.lower() in c['role'].lower()
            ]
        
        # Sort candidates
        if sort_by == 'name':
            filtered_candidates.sort(key=lambda c: c['name'], reverse=(sort_order == 'desc'))
        elif sort_by == 'matchScore':
            filtered_candidates.sort(key=lambda c: c['matchScore'], reverse=(sort_order == 'desc'))
        elif sort_by == 'appliedDate':
            filtered_candidates.sort(key=lambda c: c['appliedDate'], reverse=(sort_order == 'desc'))
        
        # Calculate pagination
        total_candidates = len(filtered_candidates)
        total_pages = (total_candidates + limit - 1) // limit
        
        # Apply pagination
        offset = (page - 1) * limit
        paginated_candidates = filtered_candidates[offset:offset + limit]
        
        # Return paginated results
        return jsonify({
            'candidates': paginated_candidates,
            'pagination': {
                'page': page,
                'limit': limit,
                'totalCandidates': total_candidates,
                'totalPages': total_pages
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting candidates: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/<candidate_id>', methods=['GET'])
def get_candidate_details(candidate_id):
    """Get detailed information about a specific candidate"""
    try:
        all_candidates = get_all_candidates()
        candidate = next((c for c in all_candidates if c['id'] == candidate_id), None)
        
        if not candidate:
            return jsonify({'error': 'Candidate not found'}), 404
        
        # Get resume details and perform analysis
        resume_text = f"Mock resume text for {candidate['name']}. This would be the actual resume content in a real application.\n\n"
        resume_text += "EDUCATION\n"
        resume_text += "- Bachelor of Science in Computer Science, University of Technology (2015-2019)\n"
        resume_text += "- Master of Science in Data Science, Tech Institute (2019-2021)\n\n"
        resume_text += "EXPERIENCE\n"
        resume_text += "- Software Engineer, Tech Solutions Inc. (2021-Present)\n"
        resume_text += "- Intern, Data Analytics Corp. (2020-2021)\n\n"
        resume_text += "SKILLS\n"
        resume_text += "- Programming: JavaScript, Python, Java, SQL, TypeScript\n"
        resume_text += "- Frameworks: React, Node.js, Express, Django\n"
        resume_text += "- Tools: Git, Docker, AWS, Kubernetes\n"
        
        # Extract skills using mock AI
        skills = mock_ai.extract_skills(resume_text)
        
        # Analyze sentiment
        sentiment = mock_ai.analyze_sentiment(resume_text)
        
        # Mock education data
        education = [
            "Bachelor of Science in Computer Science, University of Technology (2015-2019)",
            "Master of Science in Data Science, Tech Institute (2019-2021)"
        ]
        
        # Mock experience data
        years_of_experience = 4
        
        # Compute skill statistics
        skill_frequency = {skill: skills.count(skill) for skill in set(skills)}
        
        # Sort skills by frequency for top skills
        top_skills = sorted(skill_frequency.items(), key=lambda x: x[1], reverse=True)
        top_skills = [skill for skill, _ in top_skills[:10]]
        
        # Mock skill categories
        skill_categories = {
            'technical': 12,
            'soft': 3,
            'tools': 5
        }
        
        # Calculate skill distribution
        skill_distribution = {
            'frontend': 5,
            'backend': 5,
            'database': 2,
            'devops': 4,
            'soft_skills': 4
        }
        
        # Calculate category percentages for pie chart
        total_skills = sum(skill_categories.values())
        category_percentages = {
            category: round((count / total_skills) * 100) if total_skills > 0 else 0
            for category, count in skill_categories.items()
        }
        
        skill_stats = {
            'topSkills': top_skills,
            'skillFrequency': skill_frequency,
            'totalSkills': len(set(skills)),
            'skillCategories': skill_categories,
            'skillDistribution': skill_distribution,
            'education': education,
            'yearsOfExperience': years_of_experience,
            'categoryPercentages': category_percentages
        }
        
        return jsonify({
            'candidate': candidate,
            'resume': {
                'text': resume_text,
                'skills': skills,
                'sentiment': sentiment,
                'stats': skill_stats
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting candidate details: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/send-email', methods=['POST'])
def send_email_to_candidates():
    """Send emails to selected candidates"""
    try:
        data = request.get_json()
        
        if not data or 'candidateIds' not in data or not data['candidateIds']:
            return jsonify({'error': 'No candidates selected'}), 400
        
        if 'subject' not in data or not data['subject']:
            return jsonify({'error': 'Email subject is required'}), 400
        
        if 'message' not in data or not data['message']:
            return jsonify({'error': 'Email message is required'}), 400
        
        candidate_ids = data['candidateIds']
        subject = data['subject']
        message = data['message']
        
        # Get all candidates
        all_candidates = get_all_candidates()
        
        # Filter selected candidates
        selected_candidates = [c for c in all_candidates if c['id'] in candidate_ids]
        
        if not selected_candidates:
            return jsonify({'error': 'No valid candidates found'}), 400
        
        # In a real application, this would send actual emails
        # For this mock implementation, we'll just return success
        
        return jsonify({
            'message': f'Emails sent successfully to {len(selected_candidates)} candidates',
            'sentTo': [{'id': c['id'], 'name': c['name'], 'email': c['email']} for c in selected_candidates]
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error sending emails: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

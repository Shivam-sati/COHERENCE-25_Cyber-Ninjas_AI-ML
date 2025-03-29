from flask import Blueprint, request, jsonify, current_app
import os
import json
from datetime import datetime
from app.utils.mock_ai import MockAIModel

bp = Blueprint('candidate', __name__, url_prefix='/api/candidates')
mock_ai = MockAIModel()

def get_candidates_file():
    """Get the path to the candidates.json file and ensure it exists"""
    data_dir = os.path.join(current_app.root_path, 'data')
    candidates_file = os.path.join(data_dir, 'candidates.json')
    
    # Create data directory if it doesn't exist
    os.makedirs(data_dir, exist_ok=True)
    
    # Create default candidates.json if it doesn't exist
    if not os.path.exists(candidates_file):
        default_candidates = [
            {
                'id': 1,
                'name': 'John Doe',
                'email': 'john@example.com',
                'phone': '+1234567890',
                'role': 'Software Engineer',
                'matchScore': 85,
                'skills': ['Python', 'JavaScript', 'React'],
                'appliedDate': '2024-01-01'
            },
            {
                'id': 2,
                'name': 'Jane Smith',
                'email': 'jane@example.com',
                'phone': '+0987654321',
                'role': 'Data Scientist',
                'matchScore': 92,
                'skills': ['Python', 'Machine Learning', 'SQL'],
                'appliedDate': '2024-01-02'
            }
        ]
        with open(candidates_file, 'w') as f:
            json.dump(default_candidates, f, indent=2)
    
    return candidates_file

def get_all_candidates():
    """Get all candidates from the mock database"""
    try:
        candidates_file = get_candidates_file()
        if not os.path.exists(candidates_file):
            return []
        
        with open(candidates_file, 'r') as f:
            candidates = json.load(f)
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
                search in c.get('name', '').lower() or 
                search in c.get('email', '').lower() or 
                search in c.get('role', '').lower() or
                any(search in skill.lower() for skill in c.get('skills', []))
            ]
        
        # Apply role filter
        if role_filter != 'all':
            filtered_candidates = [
                c for c in filtered_candidates if 
                role_filter.lower() in c.get('role', '').lower()
            ]
        
        # Sort candidates
        if sort_by == 'name':
            filtered_candidates.sort(key=lambda c: c.get('name', ''), reverse=(sort_order == 'desc'))
        elif sort_by == 'matchScore':
            filtered_candidates.sort(key=lambda c: c.get('matchScore', 0), reverse=(sort_order == 'desc'))
        elif sort_by == 'appliedDate':
            filtered_candidates.sort(key=lambda c: c.get('appliedDate', ''), reverse=(sort_order == 'desc'))
        
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
        return jsonify({'error': str(e)}), 500

@bp.route('/<candidate_id>', methods=['GET'])
def get_candidate_details(candidate_id):
    """Get detailed information about a specific candidate"""
    try:
        candidates_file = get_candidates_file()
        if not os.path.exists(candidates_file):
            return jsonify({'error': 'Candidate not found'}), 404
        
        with open(candidates_file, 'r') as f:
            candidates = json.load(f)
        
        candidate = next((c for c in candidates if c['id'] == candidate_id), None)
        
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

@bp.route('/', methods=['POST'])
def add_candidate():
    """Add a new candidate"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        candidates_file = get_candidates_file()
        candidates = []
        
        # Read existing candidates if file exists
        if os.path.exists(candidates_file):
            with open(candidates_file, 'r') as f:
                candidates = json.load(f)
        
        # Add new candidate with timestamp
        new_candidate = {
            'id': len(candidates) + 1,
            'name': data.get('name'),
            'email': data.get('email'),
            'phone': data.get('phone'),
            'resume_url': data.get('resume_url'),
            'created_at': datetime.now().isoformat()
        }
        
        candidates.append(new_candidate)
        
        # Save updated candidates
        with open(candidates_file, 'w') as f:
            json.dump(candidates, f, indent=2)
        
        return jsonify({
            'message': 'Candidate added successfully',
            'candidate': new_candidate
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error adding candidate: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/<int:candidate_id>', methods=['GET'])
def get_candidate(candidate_id):
    """Get a specific candidate by ID"""
    try:
        candidates_file = get_candidates_file()
        if not os.path.exists(candidates_file):
            return jsonify({'error': 'Candidate not found'}), 404
        
        with open(candidates_file, 'r') as f:
            candidates = json.load(f)
        
        candidate = next((c for c in candidates if c['id'] == candidate_id), None)
        if not candidate:
            return jsonify({'error': 'Candidate not found'}), 404
        
        return jsonify({'candidate': candidate}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting candidate: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/<int:candidate_id>', methods=['PUT'])
def update_candidate(candidate_id):
    """Update a candidate"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        candidates_file = get_candidates_file()
        if not os.path.exists(candidates_file):
            return jsonify({'error': 'Candidate not found'}), 404
        
        with open(candidates_file, 'r') as f:
            candidates = json.load(f)
        
        candidate_index = next((i for i, c in enumerate(candidates) if c['id'] == candidate_id), None)
        if candidate_index is None:
            return jsonify({'error': 'Candidate not found'}), 404
        
        # Update candidate data
        candidates[candidate_index].update({
            'name': data.get('name', candidates[candidate_index]['name']),
            'email': data.get('email', candidates[candidate_index]['email']),
            'phone': data.get('phone', candidates[candidate_index]['phone']),
            'resume_url': data.get('resume_url', candidates[candidate_index]['resume_url']),
            'updated_at': datetime.now().isoformat()
        })
        
        # Save updated candidates
        with open(candidates_file, 'w') as f:
            json.dump(candidates, f, indent=2)
        
        return jsonify({
            'message': 'Candidate updated successfully',
            'candidate': candidates[candidate_index]
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating candidate: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/<int:candidate_id>', methods=['DELETE'])
def delete_candidate(candidate_id):
    """Delete a candidate"""
    try:
        candidates_file = get_candidates_file()
        if not os.path.exists(candidates_file):
            return jsonify({'error': 'Candidate not found'}), 404
        
        with open(candidates_file, 'r') as f:
            candidates = json.load(f)
        
        candidate_index = next((i for i, c in enumerate(candidates) if c['id'] == candidate_id), None)
        if candidate_index is None:
            return jsonify({'error': 'Candidate not found'}), 404
        
        # Remove candidate
        deleted_candidate = candidates.pop(candidate_index)
        
        # Save updated candidates
        with open(candidates_file, 'w') as f:
            json.dump(candidates, f, indent=2)
        
        return jsonify({
            'message': 'Candidate deleted successfully',
            'candidate': deleted_candidate
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting candidate: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

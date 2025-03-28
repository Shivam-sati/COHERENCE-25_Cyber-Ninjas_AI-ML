from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from app.utils.file_processor import FileProcessor
from app.utils.mock_ai import MockAIModel

bp = Blueprint('resume', __name__, url_prefix='/api/resume')
file_processor = FileProcessor(os.path.join(current_app.root_path, 'uploads'))
mock_ai = MockAIModel()

@bp.route('/upload', methods=['POST'])
def upload_resume():
    """Handle resume file upload and initial processing"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Save and validate file
        success, file_path, error = file_processor.save_file(file)
        if not success:
            return jsonify({'error': error}), 400
        
        # Read file content
        success, content, error = file_processor.read_file_content(file_path)
        if not success:
            file_processor.cleanup_file(file_path)
            return jsonify({'error': error}), 400
        
        # Analyze resume using mock AI
        resume_data = mock_ai.analyze_resume(content)
        
        # Clean up the file
        file_processor.cleanup_file(file_path)
        
        return jsonify({
            'message': 'Resume processed successfully',
            'data': resume_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error processing resume: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/analyze', methods=['POST'])
def analyze_resume():
    """Analyze resume content"""
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({'error': 'No content provided'}), 400
        
        # Extract skills
        skills = mock_ai.extract_skills(data['content'])
        
        # Analyze sentiment
        sentiment = mock_ai.analyze_sentiment(data['content'])
        
        # Analyze candidate
        candidate_analysis = mock_ai.analyze_candidate(data)
        
        return jsonify({
            'skills': skills,
            'sentiment': sentiment,
            'candidate_analysis': candidate_analysis
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error analyzing resume: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/skills', methods=['POST'])
def extract_skills():
    """Extract skills from resume content"""
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({'error': 'No content provided'}), 400
        
        skills = mock_ai.extract_skills(data['content'])
        
        return jsonify({
            'skills': skills
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error extracting skills: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/sentiment', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of resume content"""
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({'error': 'No content provided'}), 400
        
        sentiment = mock_ai.analyze_sentiment(data['content'])
        
        return jsonify({
            'sentiment': sentiment
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error analyzing sentiment: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500 
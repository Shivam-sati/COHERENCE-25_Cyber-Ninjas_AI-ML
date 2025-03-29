from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from app.utils.file_processor import FileProcessor
from app.utils.resume_processor import ResumeProcessor
from typing import List, Dict, Any

bp = Blueprint('resume', __name__, url_prefix='/api/resume')

# Initialize processors
def get_file_processor():
    return FileProcessor(os.path.join(current_app.root_path, 'uploads'))

def get_resume_processor():
    return ResumeProcessor(os.path.dirname(current_app.root_path))

@bp.route('/upload', methods=['POST'])
def upload_resume():
    """Handle bulk resume upload and processing"""
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files')
    job_description = request.form.get('job_description', '')
    limit = int(request.form.get('limit', 15))
    
    if not files:
        return jsonify({'error': 'No files selected'}), 400
    
    if not job_description:
        return jsonify({'error': 'Job description is required'}), 400
    
    # Initialize processors
    file_processor = get_file_processor()
    resume_processor = get_resume_processor()
    
    # Save and validate files
    saved_files = []
    for file in files:
        if file.filename == '':
            continue
        
        success, file_path, error = file_processor.save_file(file)
        if success:
            saved_files.append(file_path)
        else:
            return jsonify({'error': error}), 400
    
    try:
        # Process resumes
        results = resume_processor.process_resumes(saved_files, job_description, limit)
        
        # Clean up saved files
        for file_path in saved_files:
            file_processor.cleanup_file(file_path)
        
        return jsonify(results), 200
        
    except Exception as e:
        # Clean up files in case of error
        for file_path in saved_files:
            file_processor.cleanup_file(file_path)
        return jsonify({'error': str(e)}), 500

@bp.route('/history', methods=['GET'])
def get_analysis_history():
    """Get historical analysis data"""
    try:
        resume_processor = get_resume_processor()
        return jsonify(resume_processor.get_analysis_history()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/candidates/<int:limit>', methods=['GET'])
def get_top_candidates(limit: int):
    """Get top candidates from all historical analyses"""
    try:
        resume_processor = get_resume_processor()
        return jsonify({'candidates': resume_processor.get_top_candidates(limit)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
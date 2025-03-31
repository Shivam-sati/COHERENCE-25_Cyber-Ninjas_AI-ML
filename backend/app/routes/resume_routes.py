from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import traceback
from app.utils.file_processor import FileProcessor
from app.utils.resume_processor import ResumeProcessor
from typing import List, Dict, Any

bp = Blueprint('resume', __name__, url_prefix='/api/resume')

# Initialize processors
def get_file_processor():
    upload_dir = os.path.join(current_app.root_path, 'uploads')
    # Ensure upload directory exists
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    return FileProcessor(upload_dir)

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
    
    if not files or all(file.filename == '' for file in files):
        return jsonify({'error': 'No files selected'}), 400
    
    if not job_description:
        return jsonify({'error': 'Job description is required'}), 400
    
    # Initialize processors
    file_processor = get_file_processor()
    resume_processor = get_resume_processor()
    
    # Save and validate files
    saved_files = []
    error_files = []
    
    for file in files:
        if file.filename == '':
            continue
        
        success, file_path, error = file_processor.save_file(file)
        if success:
            saved_files.append(file_path)
        else:
            error_files.append({
                'filename': file.filename,
                'error': error or 'Unknown error'
            })
    
    # If no files were successfully saved, return error
    if not saved_files:
        return jsonify({
            'error': 'No valid files were uploaded',
            'file_errors': error_files
        }), 400
    
    try:
        # Process resumes
        results = resume_processor.process_resumes(saved_files, job_description, limit)
        
        # Include information about files with errors if any
        if error_files:
            results['file_errors'] = error_files
        
        # Clean up saved files
        cleanup_errors = []
        for file_path in saved_files:
            try:
                if not file_processor.cleanup_file(file_path):
                    cleanup_errors.append(f"Failed to remove {os.path.basename(file_path)}")
            except Exception as e:
                current_app.logger.error(f"Error cleaning up file {file_path}: {str(e)}")
                cleanup_errors.append(f"Error removing {os.path.basename(file_path)}: {str(e)}")
        
        if cleanup_errors:
            results['cleanup_warnings'] = cleanup_errors
            
        return jsonify(results), 200
        
    except Exception as e:
        current_app.logger.error(f"Error processing resumes: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        
        # Clean up files in case of error
        for file_path in saved_files:
            try:
                file_processor.cleanup_file(file_path)
            except Exception as cleanup_error:
                current_app.logger.error(f"Error cleaning up file {file_path}: {str(cleanup_error)}")
        
        return jsonify({
            'error': f"Error processing resumes: {str(e)}",
            'file_errors': error_files
        }), 500

@bp.route('/history', methods=['GET'])
def get_analysis_history():
    """Get historical analysis data"""
    try:
        resume_processor = get_resume_processor()
        return jsonify(resume_processor.get_analysis_history()), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving analysis history: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@bp.route('/candidates/<int:limit>', methods=['GET'])
def get_top_candidates(limit: int):
    """Get top candidates from all historical analyses"""
    try:
        resume_processor = get_resume_processor()
        candidates = resume_processor.get_top_candidates(limit)
        return jsonify({'candidates': candidates}), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving candidates: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
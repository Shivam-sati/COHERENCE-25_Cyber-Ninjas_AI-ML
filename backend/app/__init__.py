from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
import logging
from logging.handlers import RotatingFileHandler
import os
from app.utils.email_service import EmailService

def create_app():
    app = Flask(__name__)
    app.wsgi_app = ProxyFix(app.wsgi_app)
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Configure logging
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    # Use a different logging configuration for Windows
    if os.name == 'nt':  # Windows
        file_handler = logging.FileHandler('logs/app.log', mode='a', encoding='utf-8')
    else:  # Unix/Linux
        file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
    
    file_handler.setFormatter(logging.Formatter(
        '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Application startup')
    
    # Create required directories
    directories_to_create = [
        os.path.join(app.root_path, 'data'),
        os.path.join(app.root_path, 'templates', 'emails'),
        os.path.join(app.root_path, 'uploads')  # Add uploads directory
    ]
    
    for directory in directories_to_create:
        if not os.path.exists(directory):
            try:
                os.makedirs(directory)
                app.logger.info(f"Created directory: {directory}")
            except Exception as e:
                app.logger.error(f"Failed to create directory {directory}: {str(e)}")
    
    # Initialize email service
    email_service = EmailService(app)
    app.email_service = email_service
    
    # Root URL route
    @app.route('/')
    def index():
        return jsonify({
            'status': 'ok',
            'message': 'Resume Analysis API is running',
            'endpoints': {
                'candidates': '/api/candidates',
                'resume': '/api/resume'
            }
        })
    
    # Register blueprints
    from app.routes import resume_routes, candidate_routes
    app.register_blueprint(resume_routes.bp)
    app.register_blueprint(candidate_routes.bp)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return {'error': 'Not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error('Server Error: %s', error)
        return {'error': 'Internal server error'}, 500
    
    @app.errorhandler(Exception)
    def unhandled_exception(e):
        app.logger.error('Unhandled Exception: %s', e)
        return {'error': 'Internal server error'}, 500
    
    return app
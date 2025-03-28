from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
import logging
from logging.handlers import RotatingFileHandler
import os

def create_app():
    app = Flask(__name__)
    app.wsgi_app = ProxyFix(app.wsgi_app)
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Configure logging
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Application startup')
    
    # Register blueprints
    from app.routes import resume_routes, analysis_routes
    app.register_blueprint(resume_routes.bp)
    app.register_blueprint(analysis_routes.bp)
    
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
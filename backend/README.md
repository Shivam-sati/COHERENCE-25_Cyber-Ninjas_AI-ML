# Resume Analysis Backend

A Flask-based backend service for analyzing resumes using AI. This service provides endpoints for resume upload, parsing, candidate analysis, skills extraction, and sentiment analysis.

## Features

- Resume file upload and processing
- Candidate analysis with mock AI model
- Skills extraction
- Sentiment analysis
- File validation and security
- Error handling and logging
- CORS support

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory:
```env
FLASK_APP=app
FLASK_ENV=development
FLASK_DEBUG=1
```

## Running the Application

Development server:
```bash
flask run
```

Production server:
```bash
gunicorn "app:create_app()"
```

## API Endpoints

### Resume Upload
- **POST** `/api/resume/upload`
  - Upload and process a resume file
  - Accepts multipart/form-data with 'file' field
  - Returns parsed resume data

### Resume Analysis
- **POST** `/api/resume/analyze`
  - Analyze resume content
  - Accepts JSON with 'content' field
  - Returns skills, sentiment, and candidate analysis

### Skills Extraction
- **POST** `/api/resume/skills`
  - Extract skills from resume content
  - Accepts JSON with 'content' field
  - Returns list of skills

### Sentiment Analysis
- **POST** `/api/resume/sentiment`
  - Analyze sentiment of resume content
  - Accepts JSON with 'content' field
  - Returns sentiment analysis results

## File Requirements

- Supported formats: PDF, DOC, DOCX, TXT
- Maximum file size: 5MB
- Files are automatically cleaned up after processing

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
```

### Linting
```bash
flake8
```

## Error Handling

The application includes comprehensive error handling for:
- File upload errors
- Invalid file types
- File size limits
- Processing errors
- Server errors

All errors are logged and appropriate HTTP status codes are returned.

## Security

- File type validation using python-magic
- Secure filename handling
- CORS configuration
- File size limits
- Automatic file cleanup

## Logging

Logs are stored in the `logs` directory with rotation enabled:
- Maximum file size: 10KB
- Backup count: 10 files 
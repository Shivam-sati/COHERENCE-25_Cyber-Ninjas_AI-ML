# Resume Analyzer

A full-stack application that analyzes resumes using AI and provides insights for job matching and candidate evaluation.

## Project Structure

- `frontend/` - React application built with Vite
- `backend/` - Flask backend with AI integration for resume analysis

## Features

- Resume upload and parsing (PDF and DOCX formats)
- AI-powered resume analysis
- Skill categorization and extraction
- Candidate management and scoring
- Job description matching
- Visualization of analysis results
- Email notifications

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Router
- D3.js for data visualization
- React Query for API data management

### Backend
- Flask
- Python
- Scikit-learn for ML functionality
- NLTK for natural language processing
- PDF and DOCX parsing libraries
- RESTful API structure

## Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- Git

### Backend Setup
```bash
cd backend
pip install -r requirements.txt nltk numpy pandas scikit-learn joblib docx2txt pdfplumber python-magic
python wsgi.py
```

The backend will be available at http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5174

## Environment Variables

### Backend
Create a `.env` file in the backend directory with the following variables:
```
FLASK_APP=app
FLASK_ENV=development
```

### Frontend
Create a `.env` file in the frontend directory with the following variables:
```
VITE_FLASK_API_URL=http://localhost:5000
```

## API Endpoints

- `/api/resume/upload` - Upload and analyze resumes
- `/api/resume/history` - Get analysis history
- `/api/resume/candidates` - Get top candidates from all analyses
- `/api/candidates` - Manage candidate information

## License

MIT

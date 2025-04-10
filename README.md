# Resume Analyzer

A full-stack application that analyzes resumes using AI and provides insights through a 3D visualization interface.

## Project Structure

- `hackathon/` - Frontend Next.js application
- `backend/` - Flask backend with AI integration

## Features

- Resume upload and parsing
- AI-powered resume analysis
- 3D visualization of analysis results
- User authentication
- Real-time feedback

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Three.js
- tRPC

### Backend
- Flask
- Python
- AI/ML integration
- PostgreSQL

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL

### Frontend Setup
```bash
cd hackathon
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Environment Variables

Create `.env` files in both frontend and backend directories based on the provided `.env.example` files.

## License

MIT

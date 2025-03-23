# Article Summarizer

A full-stack application that summarizes articles using DeepSeek AI. Simply input an article URL, and get a concise summary powered by OpenRouter's DeepSeek model.

## Features

- Article URL input and validation
- AI-powered summarization using DeepSeek model via OpenRouter
- Clean, responsive UI built with React and Chakra UI
- FastAPI backend with error handling and CORS support

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Chakra UI for components
- Axios for API calls

### Backend
- FastAPI (Python)
- BeautifulSoup4 for article parsing
- OpenRouter API integration
- CORS middleware enabled

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- OpenRouter API key

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here 
```

## Frontend Setup & Deployment

### Local Development Setup

1. Create a new React project with Vite:
```bash
cd frontend
```

2. Install required dependencies:
```bash
npm install
```

3. Create environment file `.env`:
```
VITE_API_URL=you_api_url_here
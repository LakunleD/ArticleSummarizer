from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ArticleRequest(BaseModel):
    url: str

class SummaryResponse(BaseModel):
    summary: str

@app.get("/")
async def read_root():
    return {"message": "Welcome to Article Summarizer API"}

@app.post("/summarize", response_model=SummaryResponse)
async def summarize_article(article: ArticleRequest):
    try:
        response = requests.get(article.url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        paragraphs = soup.find_all('p')
        article_text = ' '.join([p.get_text() for p in paragraphs])

        headers = {
            "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek/deepseek-chat:free",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant that summarizes articles concisely and accurately."
                },
                {
                    "role": "user",
                    "content": f"Please provide a concise summary of this article: {article_text[:4000]}"
                }
            ],
            'provider': {
                'allow_fallbacks': True
            }
        }
        
        summary_response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload
        )
        
        if summary_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Error getting summary from AI service")

        summary = summary_response.json()["choices"][0]["message"]["content"]
        return SummaryResponse(summary=summary)
        
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching article: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}") 
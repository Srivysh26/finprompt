import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from groq import Groq
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str


@app.get("/")
def home():
    return {
        "message": "FinPrompt API is running"
    }


@app.post("/optimize")
def optimize_prompt(request: PromptRequest):
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a prompt optimization assistant. "
                    "Improve the user's prompt so it is clear, specific, "
                    "well-structured, and produces a better response from an LLM. "
                    "Return only the improved prompt."
                )
            },
            {
                "role": "user",
                "content": request.prompt
            }
        ]
    )
    improved_prompt = response.choices[0].message.content


    return {
        "original_prompt": request.prompt,
        "improved_prompt": improved_prompt
    }

import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from google import genai
from google.genai import types
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middelware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# simple in-memory limit for the hackathon
user_limits = {} 
@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI!"}

@app.post("/api/generate-quiz")
async def generate_quiz(
    user_id: str = Form(...),
    text: str = Form(...),
    image: UploadFile = File(None)
):
    # 1. Check Limits (e.g., 3 quizzes per user for the demo)
    if user_limits.get(user_id, 0) >= 3:
        raise HTTPException(status_code=429, detail="Daily limit reached!")

    # 2. Build Multi-modal Content
    contents = [text]
    if image:
        image_bytes = await image.read()
        contents.append(types.Part.from_bytes(
            data=image_bytes, 
            mime_type=image.content_type
        ))

    # 3. Request Structured Quiz from Gemini
    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents=contents,
        config={
            "response_mime_type": "application/json",
            "system_instruction": "Generate a multiple choice quiz. If images are provided, ask at least one question about diagrams or visual data shown."
        }
    )

    user_limits[user_id] = user_limits.get(user_id, 0) + 1
    return response.parsed
    
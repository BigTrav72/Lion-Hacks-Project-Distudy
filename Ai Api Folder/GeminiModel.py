import os
from xml.parsers.expat import model
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

#1. Setup Gemini API Key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro")
app = FastAPI()

#2. Define data structure
class QuizRequest(BaseModel):
    text: str

#3. Create API endpoint
@app.post("/generate-quiz")
async def create_quiz(request: QuizRequest):
  
        #4. Generate quiz using Gemini API
        response = model.generate_content(
        prompt, "Create a quiz based on the following pdf: {request.pdf}",
            
        ) 
        return json.loads(response.text)
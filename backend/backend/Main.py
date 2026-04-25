import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI()

# Allow React to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

@app.post("/api/generate-quiz")
async def generate_quiz(
    text: str = Form(...), 
    user_id: str = Form(...),
    image: UploadFile = File(None)
):
    try:
        prompt = f"Generate a 3-question multiple choice quiz based on this text: {text}"
        
        if image:
            # Logic to handle image bytes for Gemini
            image_data = await image.read()
            contents = [prompt, {"mime_type": image.content_type, "data": image_data}]
            response = model.generate_content(contents)
        else:
            response = model.generate_content(prompt)

        return {"status": "success", "quiz": response.text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
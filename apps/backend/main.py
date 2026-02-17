from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import redis
import os
import time
import json
import uuid
import requests
import random

app = FastAPI(title="SentinAI API Gateway")

# Connect to Redis
redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, db=0)

# OLLAMA Endpoint (Host Machine IP)
OLLAMA_URL = "http://172.17.0.1:11434/api/generate"

class PromptRequest(BaseModel):
    user_id: str
    prompt: str

@app.post("/submit-task")
async def submit_ai_task(request: PromptRequest):
    # Trap B: 10% Random Crash
    if random.random() < 0.1:
        raise HTTPException(status_code=500, detail="AI Service Overloaded (Simulated 500)")

    task_id = str(uuid.uuid4())
    task_data = {
        "id": task_id,
        "prompt": request.prompt,
        "status": "QUEUED",
        "timestamp": time.time()
    }
    
    redis_client.set(f"task:{task_id}", json.dumps(task_data))
    return {"task_id": task_id, "message": "Task queued"}

@app.get("/task/{task_id}")
def get_task_status(task_id: str):
    data = redis_client.get(f"task:{task_id}")
    if not data:
        return {"error": "Task not found"}
    
    task_dict = json.loads(data)
    
    if task_dict["status"] == "QUEUED":
        # REAL AI LOGIC:
        # Instead of sleeping, we call Ollama
        try:
            response = requests.post(OLLAMA_URL, json={
                "model": "phi3",
                "prompt": task_dict["prompt"],
                "stream": False
            }, timeout=120) # 30s timeout
            
            if response.status_code == 200:
                ai_text = response.json().get("response", "No response")
                task_dict["status"] = "COMPLETED"
                task_dict["result"] = ai_text
                
                # Update Redis with the Real Answer
                redis_client.set(f"task:{task_id}", json.dumps(task_dict))
            else:
                 # If Ollama fails, we keep it queued to retry later
                 print("Ollama Error:", response.text)

        except Exception as e:
            print(f"AI Connection Error: {e}")
            # In a real app, we might mark as FAILED or retry
    
    return task_dict

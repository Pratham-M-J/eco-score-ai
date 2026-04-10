from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import uvicorn
from agent import build_graph

# 1. Define the input schema for the API
class ProductRequest(BaseModel):
    url: str

# 2. Initialize FastAPI
app = FastAPI(
    title="Eco-Score.AI",
    description="An agentic workflow that analyzes product URLs and predicts carbon emissions.",
    version="1.0.0"
)

# 3. Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# 4. Build the graph once on startup
agent_graph = build_graph()

# 5. Create the endpoint
@app.post("/analyze")
async def analyze_product(request: ProductRequest):
    print(f"🚀 Received API request for URL: {request.url}")
    
    try:
        # Initialize the state for LangGraph
        initial_state = {
            "product_link": request.url
        }
        
        # Invoke the graph (this runs the extractor -> predictor -> report generator)
        result = agent_graph.invoke(initial_state)
        
        # Return the comprehensive data as JSON
        return {
            "status": "success",
            "message": "Analysis complete.",
            "data": {
                "extracted_features": result.get("user_payload"),
                "prediction": result.get("prediction_result"),
                "raw_report": result.get("raw_report"),
                "final_report": result.get("final_report")
            }
        }
        
    except Exception as e:
        print(f"🚨 API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 6. Run the server (if executing directly)
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
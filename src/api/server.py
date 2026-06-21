import sys
from pathlib import Path
import pandas as pd
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse

# Add src to Python path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.config import BASE_DIR
from src.data_ingestion.phase1_gee_pipeline import build_spatial_data_cube, authenticate_and_initialize

app = FastAPI(title="UrbanHeatAI Backend", version="1.0.0")

# Allow all CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/strategy-data")
async def get_strategy_data():
    """
    Returns the pre-calculated PINN optimization strategy data.
    """
    data_path = BASE_DIR / "models" / "optimal_intervention_strategy.csv"
    if not data_path.exists():
        raise HTTPException(status_code=404, detail="Strategy data not found. Please run the ML pipeline first.")
    
    # Returning the CSV file directly to the frontend for parsing
    return FileResponse(path=data_path, media_type="text/csv", filename="optimal_intervention_strategy.csv")

def trigger_gee_pipeline_task():
    """Background task for GEE extraction."""
    try:
        authenticate_and_initialize()
        df = build_spatial_data_cube()
        output_csv = BASE_DIR / "pune_spatial_data_cube_30m.csv"
        df.to_csv(output_csv, index=False)
        print(f"Data successfully saved to {output_csv}")
    except Exception as e:
        print(f"Error running GEE pipeline: {str(e)}")

@app.post("/api/trigger-gee")
async def trigger_gee(background_tasks: BackgroundTasks):
    """
    Triggers the Google Earth Engine data ingestion in the background.
    """
    background_tasks.add_task(trigger_gee_pipeline_task)
    return JSONResponse(content={"message": "GEE data extraction triggered successfully. Processing in the background."})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.api.server:app", host="0.0.0.0", port=8000, reload=True)

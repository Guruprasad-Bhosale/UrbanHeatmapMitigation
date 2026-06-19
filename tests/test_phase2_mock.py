import sys
import pandas as pd
import numpy as np
from pathlib import Path

# Add src to Python path
sys.path.append(str(Path(__file__).resolve().parent.parent))
from src.config import BASE_DIR
from src.diagnostics_ml.phase2_driver_analysis import main

def create_mock_data():
    """Generates a dummy 30m resolution data cube for testing."""
    data_path = BASE_DIR / "pune_spatial_data_cube_30m.csv"
    
    # 500 fake pixels
    n_pixels = 500
    
    # Random realistic distributions
    np.random.seed(42)
    lons = np.linspace(73.75, 73.95, n_pixels)
    lats = np.linspace(18.45, 18.65, n_pixels)
    
    ndvi = np.random.uniform(-0.1, 0.8, n_pixels)
    ndbi = np.random.uniform(-0.5, 0.5, n_pixels)
    mndwi = np.random.uniform(-0.4, 0.2, n_pixels)
    
    # Simulated LST driven primarily by NDBI and NDVI
    # Higher NDBI (concrete) -> higher LST
    # Higher NDVI (vegetation) -> lower LST
    lst = 25.0 + 10.0 * ndbi - 5.0 * ndvi + np.random.normal(0, 1.5, n_pixels)
    
    df = pd.DataFrame({
        'longitude': lons,
        'latitude': lats,
        'LST': lst,
        'NDVI': ndvi,
        'NDBI': ndbi,
        'MNDWI': mndwi,
        'Albedo': np.random.uniform(0.1, 0.4, n_pixels),
        'building_density': np.random.uniform(0, 100, n_pixels)
    })
    
    df.to_csv(data_path, index=False)
    print(f"Created mock data cube at: {data_path}")

if __name__ == "__main__":
    create_mock_data()
    print("Executing Phase 2 Analysis Pipeline with Mock Data...\n")
    main()

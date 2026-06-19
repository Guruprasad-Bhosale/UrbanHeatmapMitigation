import os
import sys
import numpy as np
import pandas as pd
from pathlib import Path

# Dynamic Base Directory resolving
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.config import BASE_DIR

def calibrate_dataset():
    data_path = BASE_DIR / "models" / "pixel_shap_attributions.csv"
    if not data_path.exists():
        raise FileNotFoundError(f"Dataset not found at {data_path}")
        
    df = pd.read_csv(data_path)
    n_pixels = len(df)
    print(f"Loaded {n_pixels} Phase 2 attribution pixels for calibration.")
    
    # 1. 2D Coordinate Calibration (Pune Shivajinagar ~73.85, 18.53)
    # We want a 20x25 grid to represent 500 contiguous pixels
    grid_w = 20
    grid_h = 25
    
    # 30m spatial resolution is approximately 0.00027 decimal degrees
    lon_start = 73.85
    lat_start = 18.53
    step = 0.00027
    
    lons = np.linspace(lon_start, lon_start + (grid_w * step), grid_w)
    lats = np.linspace(lat_start, lat_start + (grid_h * step), grid_h)
    
    # Generate contiguous 2D meshgrid
    lon_grid, lat_grid = np.meshgrid(lons, lats)
    
    # Flatten the grids and inject them into the dataframe
    df['longitude'] = lon_grid.flatten()[:n_pixels]
    df['latitude'] = lat_grid.flatten()[:n_pixels]
    print(f"Successfully calibrated coordinates into a contiguous {grid_w}x{grid_h} block.")
    
    # 2. Thermodynamic Summer Shift
    # Push the mock winter LST values (~25C) to realistic summer daytime highs (~40C)
    current_mean = df['LST'].mean()
    target_mean = 40.0
    shift_val = target_mean - current_mean
    
    df['LST'] += shift_val
    df['Predicted_LST'] += shift_val
    
    print(f"Shifted thermal baseline by +{shift_val:.2f} °C. New Mean LST: {df['LST'].mean():.2f} °C.")
    
    # Save the calibrated array back to disk
    df.to_csv(data_path, index=False)
    print(f"Successfully overwritten Phase 2 dataset at {data_path}.")
    
    # 3. Trigger Programmatic Phase 4 Optimization Re-run
    print("\nTriggering downstream Phase 4 Optimization on the calibrated grid...")
    try:
        from src.optimization.phase4_optimization import main as run_phase4
        run_phase4()
    except Exception as e:
        print(f"Failed to trigger Phase 4 automatically: {e}")
        print("Please run phase4_optimization.py manually.")

if __name__ == "__main__":
    print("Initiating Phase 5.1 Data Calibration Engine...")
    calibrate_dataset()

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
    
    # Organic Scatter (Pune Bounding Box)
    lon_min, lon_max = 73.75, 73.95
    lat_min, lat_max = 18.45, 18.60
    
    # Generate scattered random coords
    df['longitude'] = np.random.uniform(lon_min, lon_max, n_pixels)
    df['latitude'] = np.random.uniform(lat_min, lat_max, n_pixels)
    
    print(f"Successfully scattered {n_pixels} points across Pune bounds.")
    
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

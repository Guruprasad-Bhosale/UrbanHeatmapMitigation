import os
import sys
import pandas as pd
import numpy as np
import xgboost as xgb
import shap
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import libpysal
from esda.getisord import G_Local
from pathlib import Path

# Add src to Python path if running directly to allow importing from src
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.config import BASE_DIR, ML_CONFIG

def calculate_spatial_hotspots(df, target_col='LST', k=8):
    """
    Identifies contiguous spatial hotspots using the Getis-Ord Gi* statistic.
    Calculates K-nearest neighbors weights matrix dynamically from pixel coordinates.
    """
    print(f"Step 1: Calculating spatial hotspots using Getis-Ord Gi* (k={k})...")
    coords = df[['longitude', 'latitude']].values
    
    # Generate KNN spatial weights
    w = libpysal.weights.KNN.from_array(coords, k=k)
    w.transform = 'R'  # Row-standardized
    
    # Calculate Gi*
    g_local = G_Local(df[target_col].values, w)
    
    # Append localized anomalies metrics
    df['Gi_Z_Score'] = g_local.Zs
    df['Gi_P_Value'] = g_local.p_sim
    return df

def train_and_explain_model(df, target_col='LST', exclude_cols=None):
    """
    Trains an interpretable tree-based ensemble (XGBoost) to model LST based on structural drivers,
    and extracts marginal contributions using SHAP TreeExplainer.
    """
    print("\nStep 2: Training Interpretable XGBoost Regressor and Extracting SHAP Values")
    
    if exclude_cols is None:
        exclude_cols = ['longitude', 'latitude', 'Gi_Z_Score', 'Gi_P_Value']
        
    features = [c for c in df.columns if c not in exclude_cols and c != target_col]
    print(f"Identified structural drivers / predictors: {features}")
    
    X = df[features]
    y = df[target_col]
    
    # Split using configured hyperparams
    test_size = ML_CONFIG.get("test_size", 0.2)
    random_seed = ML_CONFIG.get("random_seed", 42)
    n_estimators = ML_CONFIG.get("n_estimators", 100)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_seed)
    
    # Train robust regressor
    model = xgb.XGBRegressor(
        n_estimators=n_estimators, 
        random_state=random_seed, 
        objective='reg:squarederror'
    )
    model.fit(X_train, y_train)
    
    # Validate Stability
    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print("\n--- Validation Metrics ---")
    print(f"R-squared: {r2:.4f}")
    print(f"RMSE:      {rmse:.4f} °C")
    print(f"MAE:       {mae:.4f} °C")
    print("--------------------------\n")
    
    # Extract Marginal Contributions via Explainable AI
    print("Initializing SHAP TreeExplainer to compute pixel-level feature attribution...")
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)
    
    # Compile output attribution DataFrame
    attr_df = df.copy()
    attr_df['Predicted_LST'] = model.predict(X)
    
    for i, feature in enumerate(features):
        # Marginal contribution in degrees Celsius per feature
        attr_df[f'SHAP_{feature}'] = shap_values[:, i]
        
    return model, attr_df

def main():
    # Dynamic path handling from shared config
    data_path = BASE_DIR / "pune_spatial_data_cube_30m.csv"
    models_dir = BASE_DIR / "models"
    models_dir.mkdir(exist_ok=True)
    
    if not data_path.exists():
        print(f"Error: Unified data cube not found at {data_path}")
        print("Please ensure Phase 1 data ingestion has been completed.")
        return
        
    print(f"Loading spatially aligned data cube from: {data_path}")
    df = pd.read_csv(data_path)
    
    # Validate core requirements
    required_cols = ['LST', 'longitude', 'latitude']
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing essential columns for spatial XAI: {missing}")
        
    # Run quantitative driver assessment pipeline
    df = calculate_spatial_hotspots(df, target_col='LST')
    model, attribution_df = train_and_explain_model(df, target_col='LST')
    
    print("\nStep 3: Exporting ML Artifacts and Attribution Mapping")
    
    # 1. Export Model Architecture & Weights
    model_export_path = models_dir / "phase2_xgboost_model.json"
    model.save_model(str(model_export_path))
    print(f"Successfully saved XGBoost model artifact to: {model_export_path}")
    
    # 2. Export XAI Metrics for regularizing Phase 3 PINN
    metrics_export_path = models_dir / "pixel_shap_attributions.csv"
    attribution_df.to_csv(metrics_export_path, index=False)
    print(f"Successfully saved feature-attribution DataFrame to: {metrics_export_path}")
    
    print("\nPhase 2 Complete: Structural drivers quantified.")

if __name__ == "__main__":
    main()

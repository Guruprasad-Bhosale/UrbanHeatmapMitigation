import os
import sys
import numpy as np
import pandas as pd
import torch
from sklearn.preprocessing import MinMaxScaler
from pathlib import Path

# Add src to Python path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.config import BASE_DIR, PINN_CONFIG
from src.pinn_engine.phase3_pinn_model import UrbanPINN

def simulate_cool_roofs(df, ndbi_threshold):
    """
    Simulates Cool Roofs intervention: 
    Increases Albedo by +0.3 on built-up pixels (where NDBI > threshold).
    Albedo is capped at 1.0.
    """
    sim_df = df.copy()
    mask = sim_df['NDBI'] > ndbi_threshold
    sim_df.loc[mask, 'Albedo'] = np.clip(sim_df.loc[mask, 'Albedo'] + 0.3, a_min=None, a_max=1.0)
    return sim_df

def simulate_urban_greening(df, ndbi_threshold):
    """
    Simulates Urban Greening: 
    Increases NDVI by +0.4 on non-built-up or open space pixels (where NDBI <= threshold).
    NDVI is capped at 1.0.
    """
    sim_df = df.copy()
    mask = sim_df['NDBI'] <= ndbi_threshold
    sim_df.loc[mask, 'NDVI'] = np.clip(sim_df.loc[mask, 'NDVI'] + 0.4, a_min=None, a_max=1.0)
    return sim_df

def main():
    print("Initializing Phase 4: Prescriptive Spatial Optimization...")
    
    # 1. Dynamic Pathing
    models_dir = BASE_DIR / "models"
    data_path = models_dir / "pixel_shap_attributions.csv"
    model_path = models_dir / "phase3_pinn_pune.pth"
    output_path = models_dir / "optimal_intervention_strategy.csv"
    
    if not data_path.exists() or not model_path.exists():
        raise FileNotFoundError("Missing Phase 2 dataset or Phase 3 PyTorch PINN model.")
        
    # 2. Load Baseline Data and Synchronize Scalers
    print("Loading baseline data and refitting scaler bounds...")
    df = pd.read_csv(data_path)
    
    # Feature synchronization (exact match to Phase 3)
    exclude_cols = ['longitude', 'latitude', 'LST', 'Gi_Z_Score', 'Gi_P_Value', 'Predicted_LST']
    features = [c for c in df.columns if c not in exclude_cols and not c.startswith('SHAP_')]
    
    X_baseline = df[features].values
    y_baseline = df['LST'].values.reshape(-1, 1)
    
    # Recreate the scikit-learn MinMax scaling limits
    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()
    scaler_X.fit(X_baseline)
    scaler_y.fit(y_baseline)
    
    # 3. Load Physics-Informed Neural Network (PINN) in Evaluation Mode
    print("Loading trained PyTorch PINN model for rapid forward inference...")
    hidden_layers = PINN_CONFIG.get('hidden_layers', [128, 64, 32])
    model = UrbanPINN(input_dim=len(features), hidden_layers=hidden_layers)
    model.load_state_dict(torch.load(model_path))
    model.eval()  # NO BACKPROPAGATION
    
    # Rapid Batch Inference Helper
    def predict_lst(input_df):
        X_scaled = scaler_X.transform(input_df[features].values)
        X_tensor = torch.FloatTensor(X_scaled)
        with torch.no_grad():  # Ensure gradients are disabled
            y_pred_scaled = model(X_tensor).numpy()
        # Inverse transform to get true LST degrees Celsius
        y_pred = scaler_y.inverse_transform(y_pred_scaled)
        return y_pred.flatten()
        
    # Baseline LST Assessment
    baseline_pred_lst = predict_lst(df)
    
    # 4. Simulate Hypothetical Grid Scenarios
    print("Simulating combinatorial spatial interventions across the Pune grid...")
    # We use median NDBI to threshold "built-up" versus "open" areas robustly
    ndbi_median = df['NDBI'].median()
    
    df_cool_roofs = simulate_cool_roofs(df, ndbi_threshold=ndbi_median)
    df_urban_greening = simulate_urban_greening(df, ndbi_threshold=ndbi_median)
    
    # PINN Forward Passes
    pred_cool_roofs = predict_lst(df_cool_roofs)
    pred_urban_greening = predict_lst(df_urban_greening)
    
    # 5. Map Marginal Utility (ΔLST)
    # Delta LST = Baseline - Simulated (Positive = Cooling)
    delta_cool_roofs = baseline_pred_lst - pred_cool_roofs
    delta_urban_greening = baseline_pred_lst - pred_urban_greening
    
    df_opt = df[['longitude', 'latitude', 'LST']].copy()
    df_opt['Baseline_Predicted_LST'] = baseline_pred_lst
    df_opt['Delta_LST_Cool_Roof'] = delta_cool_roofs
    df_opt['Delta_LST_Greening'] = delta_urban_greening
    
    # Identify the highest-yielding intervention per pixel
    df_opt['Best_Intervention'] = np.where(
        delta_cool_roofs > delta_urban_greening, 
        'Cool_Roof', 
        'Urban_Greening'
    )
    df_opt['Max_Delta_LST'] = np.maximum(delta_cool_roofs, delta_urban_greening)
    
    # 6. Greedy Spatial Optimization Algorithm
    # Constraint: 10% spatial municipal budget
    spatial_budget_pct = 0.10
    budget_pixels = int(len(df_opt) * spatial_budget_pct)
    print(f"\nExecuting Greedy Heuristic Optimization...")
    print(f"Applying spatial budget constraint: {spatial_budget_pct*100:.0f}% (Target: {budget_pixels} contiguous pixels).")
    
    # Sort globally by maximum cooling potential (the greedy property)
    df_opt_sorted = df_opt.sort_values(by='Max_Delta_LST', ascending=False)
    
    df_opt_sorted['Assigned_Intervention'] = 'None'
    # Ensure we only assign interventions that actually cause cooling (ΔLST > 0)
    valid_cooling_mask = df_opt_sorted['Max_Delta_LST'] > 0
    top_n_mask = df_opt_sorted.index.isin(df_opt_sorted[valid_cooling_mask].head(budget_pixels).index)
    
    # Assign the best localized intervention to the top 10% high-yield pixels
    df_opt_sorted.loc[top_n_mask, 'Assigned_Intervention'] = df_opt_sorted.loc[top_n_mask, 'Best_Intervention']
    
    # Compute Final City-wide Mitigated LST Grid
    df_opt_sorted['Final_Mitigated_LST'] = df_opt_sorted['Baseline_Predicted_LST']
    
    cr_mask = df_opt_sorted['Assigned_Intervention'] == 'Cool_Roof'
    ug_mask = df_opt_sorted['Assigned_Intervention'] == 'Urban_Greening'
    
    df_opt_sorted.loc[cr_mask, 'Final_Mitigated_LST'] -= df_opt_sorted.loc[cr_mask, 'Delta_LST_Cool_Roof']
    df_opt_sorted.loc[ug_mask, 'Final_Mitigated_LST'] -= df_opt_sorted.loc[ug_mask, 'Delta_LST_Greening']
    
    # Standardize output for Phase 5 (Dashboard)
    output_cols = [
        'longitude', 'latitude', 'LST', 'Baseline_Predicted_LST', 
        'Final_Mitigated_LST', 'Assigned_Intervention'
    ]
    final_df = df_opt_sorted[output_cols].sort_index()
    
    # Optimization Benchmarks
    avg_cooling = baseline_pred_lst.mean() - final_df['Final_Mitigated_LST'].mean()
    total_assigned = (final_df['Assigned_Intervention'] != 'None').sum()
    
    print(f"\n--- Optimization Results ---")
    print(f"Interventions Assigned: {total_assigned} pixels")
    print(f"City-wide Average LST Drop: {avg_cooling:.4f} °C")
    print(f"Maximum localized drop (Peak Utility): {df_opt_sorted['Max_Delta_LST'].max():.4f} °C")
    print(f"----------------------------")
    
    # 7. Save Optimization Output
    final_df.to_csv(output_path, index=False)
    print(f"\nSuccessfully saved Optimal Intervention Strategy to: {output_path}")
    print("Phase 4 Execution Complete.")

if __name__ == "__main__":
    main()

import os
import sys
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from pathlib import Path

# Add src to Python path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.config import BASE_DIR, PINN_CONFIG

class UrbanPINN(nn.Module):
    """
    Physics-Informed Neural Network (PINN) for modeling Land Surface Temperature (LST).
    Uses a Multi-Layer Perceptron (MLP) architecture with Batch Normalization and Dropout
    to prevent overfitting on spatial patterns.
    """
    def __init__(self, input_dim, hidden_layers):
        super(UrbanPINN, self).__init__()
        layers = []
        current_dim = input_dim
        
        # Build hidden layers iteratively
        for next_dim in hidden_layers:
            layers.append(nn.Linear(current_dim, next_dim))
            layers.append(nn.BatchNorm1d(next_dim))
            layers.append(nn.ReLU())
            layers.append(nn.Dropout(0.2))
            current_dim = next_dim
            
        # Output layer for single LST prediction
        layers.append(nn.Linear(current_dim, 1))
        
        self.model = nn.Sequential(*layers)
        
    def forward(self, x):
        return self.model(x)

class PINNLoss(nn.Module):
    """
    Custom Loss Function that combines standard Data MSE and Physics Residual Loss.
    """
    def __init__(self, physics_lambda=0.1):
        super(PINNLoss, self).__init__()
        self.mse_loss = nn.MSELoss()
        self.physics_lambda = physics_lambda

    def forward(self, pred_lst, true_lst, ndbi, albedo, mean_lst):
        """
        Calculates total multi-objective loss.
        Physics Constraint: High NDBI (concrete) and Low Albedo (reflectivity) 
        naturally yield higher Sensible Heat, driving temperatures up.
        If structural condition dictates high heat (NDBI > Albedo) but prediction 
        is below the local average, we penalize the divergence.
        """
        # 1. Data Loss (Standard Machine Learning error)
        mse = self.mse_loss(pred_lst, true_lst)
        
        # 2. Physics Loss Approximation (Thermodynamic Divergence)
        # Delta structural: positive means driving heat (more concrete, less reflection)
        structural_delta = ndbi - albedo 
        
        # Delta temperature: positive means predicted LST is below the local average LST
        temp_delta = mean_lst - pred_lst
        
        # ReLU acts as max(0, x). We penalize heavily when BOTH conditions hold:
        # structure suggests heating AND prediction suggests cooling relative to the mean.
        # Element-wise product ensures penalty scales with the magnitude of the divergence.
        physics_residual = torch.relu(structural_delta * temp_delta)
        
        physics_loss = torch.mean(physics_residual)
        
        # Total Objective Function
        total_loss = mse + self.physics_lambda * physics_loss
        return total_loss, mse, physics_loss

def main():
    print("Initializing Phase 3: PyTorch Physics-Informed Neural Network Engine...")
    
    # 1. Load Data
    data_path = BASE_DIR / "models" / "pixel_shap_attributions.csv"
    if not data_path.exists():
        raise FileNotFoundError(f"Missing required Phase 2 data artifact: {data_path}")
        
    df = pd.read_csv(data_path)
    print(f"Loaded Phase 2 dataset: {df.shape[0]} samples.")
    
    # Identify feature columns (excluding coordinates, LST, and SHAP columns)
    exclude_cols = ['longitude', 'latitude', 'LST', 'Gi_Z_Score', 'Gi_P_Value', 'Predicted_LST']
    features = [c for c in df.columns if c not in exclude_cols and not c.startswith('SHAP_')]
    
    print(f"Using input features: {features}")
    
    # Extract indices for physics loss specific inputs
    ndbi_idx = features.index('NDBI') if 'NDBI' in features else -1
    albedo_idx = features.index('Albedo') if 'Albedo' in features else -1
    
    if ndbi_idx == -1 or albedo_idx == -1:
        raise ValueError("Missing 'NDBI' or 'Albedo' required for Physics Loss formulation. Ensure Phase 1 extracted these.")

    # 2. Preprocess & Scale (Symmetrically)
    X = df[features].values
    y = df['LST'].values.reshape(-1, 1)
    
    # We use scikit-learn MinMaxScaler to normalize inputs to [0, 1] symmetrically
    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()
    
    X_scaled = scaler_X.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y)
    
    mean_lst_scaled = np.mean(y_scaled)
    
    # 80/20 Training and Validation Split
    X_train, X_val, y_train, y_val = train_test_split(X_scaled, y_scaled, test_size=0.2, random_state=42)
    
    # Convert to PyTorch Tensors
    X_train_t = torch.FloatTensor(X_train)
    y_train_t = torch.FloatTensor(y_train)
    X_val_t = torch.FloatTensor(X_val)
    y_val_t = torch.FloatTensor(y_val)
    
    # DataLoaders for Mini-batching
    batch_size = PINN_CONFIG.get('batch_size', 256)
    train_dataset = TensorDataset(X_train_t, y_train_t)
    val_dataset = TensorDataset(X_val_t, y_val_t)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    # 3. Initialize Model Architecture, Custom Loss Wrapper, and Optimizer
    hidden_layers = PINN_CONFIG.get('hidden_layers', [128, 64, 32])
    learning_rate = PINN_CONFIG.get('learning_rate', 0.001)
    epochs = PINN_CONFIG.get('epochs', 100)
    
    # Note: lambda parameter approved by user = 0.1
    model = UrbanPINN(input_dim=len(features), hidden_layers=hidden_layers)
    criterion = PINNLoss(physics_lambda=0.1)
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    
    # Learning Rate Scheduler to mitigate plateauing
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=5)
    
    print(f"\nModel Architecture:\n{model}")
    print(f"\nTraining Configuration: LR={learning_rate}, Batch Size={batch_size}, Epochs={epochs}\n")
    
    # 4. Deep Learning Mini-Batch Training Loop
    mean_lst_tensor = torch.tensor(mean_lst_scaled, dtype=torch.float32)
    
    for epoch in range(epochs):
        model.train()
        train_loss = 0.0
        train_mse = 0.0
        train_phys = 0.0
        
        for batch_X, batch_y in train_loader:
            optimizer.zero_grad()
            
            # Forward pass
            pred_y = model(batch_X)
            
            # Extract specific variables for Physics Constraint
            batch_ndbi = batch_X[:, ndbi_idx].unsqueeze(1)
            batch_albedo = batch_X[:, albedo_idx].unsqueeze(1)
            
            # Calculate multi-objective loss
            loss, mse, phys = criterion(pred_y, batch_y, batch_ndbi, batch_albedo, mean_lst_tensor)
            
            # Backward pass and gradient optimization
            loss.backward()
            optimizer.step()
            
            # Track statistics
            train_loss += loss.item() * batch_X.size(0)
            train_mse += mse.item() * batch_X.size(0)
            train_phys += phys.item() * batch_X.size(0)
            
        # Average tracking statistics per epoch
        train_loss /= len(train_loader.dataset)
        train_mse /= len(train_loader.dataset)
        train_phys /= len(train_loader.dataset)
        
        # Validation Loop
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for batch_X, batch_y in val_loader:
                pred_y = model(batch_X)
                batch_ndbi = batch_X[:, ndbi_idx].unsqueeze(1)
                batch_albedo = batch_X[:, albedo_idx].unsqueeze(1)
                
                loss, _, _ = criterion(pred_y, batch_y, batch_ndbi, batch_albedo, mean_lst_tensor)
                val_loss += loss.item() * batch_X.size(0)
                
        val_loss /= len(val_loader.dataset)
        
        # Adjust learning rate based on validation plateau
        scheduler.step(val_loss)
        
        # Log Training Benchmarks
        if (epoch + 1) % 10 == 0 or epoch == 0:
            print(f"Epoch [{epoch+1:03d}/{epochs:03d}] - "
                  f"Train Loss: {train_loss:.4f} (MSE: {train_mse:.4f}, Phys: {train_phys:.4f}) | "
                  f"Val Loss: {val_loss:.4f} | LR: {optimizer.param_groups[0]['lr']:.6f}")
            
    # 5. Save Model Artifact
    models_dir = BASE_DIR / "models"
    models_dir.mkdir(exist_ok=True)
    model_path = models_dir / "phase3_pinn_pune.pth"
    
    torch.save(model.state_dict(), model_path)
    print(f"\nSuccessfully saved trained Phase 3 PINN state dictionary to: {model_path}")
    print("Phase 3 Execution Complete.")

if __name__ == "__main__":
    main()

import os
import yaml
from pathlib import Path

# Base directory is one level above the src folder
BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = os.path.join(BASE_DIR, "config.yaml")

def load_config(path=CONFIG_PATH):
    """
    Loads and parses the config.yaml file.
    Returns a dictionary containing the configurations.
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"Configuration file not found at: {path}")
    
    with open(path, 'r') as file:
        config = yaml.safe_load(file)
        
    return config

# Load default config upon import to expose globally
config = load_config()

# Helper accessors
SPATIAL_CONFIG = config.get("spatial", {})
DATA_CONFIG = config.get("data", {})
ML_CONFIG = config.get("ml", {})
PINN_CONFIG = config.get("pinn", {})

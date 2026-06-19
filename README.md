# Pune Urban Heat Mitigation System

An AI/ML-based geospatial system designed to optimize Urban Heat Mitigation in Pune, India. 
This project bridges spatial data engineering, Physics-Informed Neural Networks (PINNs), and spatial optimization to identify heat hotspots, analyze drivers, and generate localized cooling interventions.

## Architecture

The project is structured into five core pipeline phases:
1. **Data Ingestion (`src/data_ingestion`):** Retrieves and processes Earth Observation data (e.g., from Google Earth Engine) using the bounding box and CRS configurations.
2. **Diagnostics & ML (`src/diagnostics_ml`):** Extracts geospatial features (NDVI, Albedo, etc.) and analyzes heat drivers using tree-based regression.
3. **PINN Engine (`src/pinn_engine`):** PyTorch-based neural networks with physical constraints based on surface energy balances to model and predict heat distributions.
4. **Optimization (`src/optimization`):** Spatial placement algorithms to determine optimal locations for urban cooling interventions (e.g., green roofs, reflective surfaces).
5. **Dashboard (`src/dashboard`):** Streamlit interface for exploring diagnostics, PINN predictions, and optimization results interactively.

## Setup

1. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

2. Review and update `config.yaml` with any necessary credentials (e.g., GEE Project ID).

3. The system is designed for **EPSG:32643** (WGS 84 / UTM Zone 43N) at a **30-meter spatial resolution** representing the Pune Metropolitan Region.
# UrbanHeatmapMitigation

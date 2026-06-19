import streamlit as st
import pandas as pd
import folium
from streamlit_folium import st_folium
import branca.colormap as cm
import numpy as np
import sys
from pathlib import Path

# Add src to Python path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.config import BASE_DIR

# --- PAGE CONFIGURATION ---
st.set_page_config(page_title="Pune Urban Heat Mitigation", layout="wide", initial_sidebar_state="expanded")

# --- CSS INJECTIONS FOR UI POLISH ---
st.markdown("""
    <style>
    .big-font { font-size:24px !important; font-weight: bold; }
    div[data-testid="stMetric"] { background-color: #262730; padding: 15px; border-radius: 10px; border: 1px solid #4B4B4B; }
    </style>
""", unsafe_allow_html=True)

# --- DATA LOADING ---
@st.cache_data
def load_data():
    try:
        # Assuming the phase 4/5.1 output is saved here
        data_path = BASE_DIR / "models" / "optimal_intervention_strategy.csv"
        df = pd.read_csv(data_path)
        return df
    except FileNotFoundError:
        st.error(f"Data file not found. Ensure '{BASE_DIR}/models/optimal_intervention_strategy.csv' exists.")
        return pd.DataFrame()

df = load_data()

if not df.empty:
    # --- KPI METRICS CALCULATIONS ---
    avg_base = df['Baseline_Predicted_LST'].mean()
    avg_mitigated = df['Final_Mitigated_LST'].mean()
    avg_drop = avg_base - avg_mitigated
    max_drop = (df['Baseline_Predicted_LST'] - df['Final_Mitigated_LST']).max()
    total_interventions = df[df['Assigned_Intervention'].isin(['Cool_Roof', 'Urban_Greening'])].shape[0]

    # --- SIDEBAR ---
    with st.sidebar:
        # FIXED: Changed use_column_width to use_container_width to remove the deprecation warning
        st.image("https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Pune_Montage.png/400px-Pune_Montage.png", use_container_width=True)
        st.title("⚙️ AI Engine Settings")
        st.markdown("**Target Region:** Pune (Shivajinagar Grid)")
        st.markdown("**AI Engine:** Physics-Informed Neural Network (PINN)")
        st.markdown("**Optimization:** Greedy Marginal Utility")
        
        st.divider()
        st.subheader("Thermodynamic Legend")
        st.markdown("⚪ **Cool Roofs:** Increases Albedo (+0.3). Deflects Shortwave Radiation.")
        st.markdown("🟢 **Urban Greening:** Increases NDVI (+0.4). Dissipates Latent Heat via Evapotranspiration.")

    # --- MAIN DASHBOARD HEADER ---
    st.title("🌍 Pune Urban Heat Mitigation Strategy")
    st.markdown("AI-driven prescriptive spatial optimization for urban cooling. Designed with a strict 10% municipal footprint budget.")

    # --- KPI ROW ---
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Baseline Avg LST", f"{avg_base:.2f} °C")
    col2.metric("Mitigated Avg LST", f"{avg_mitigated:.2f} °C", f"-{avg_drop:.2f} °C")
    col3.metric("Peak Localized Cooling", f"{max_drop:.2f} °C")
    col4.metric("Grid Pixels Modified", f"{total_interventions} (10% Budget)")

    st.divider()

    # --- MAPPING SETUP ---
    # Create a unified colormap based on Pune's summer reality (35°C to 45°C)
    vmin, vmax = 35.0, 45.0
    colormap = cm.LinearColormap(colors=['#313695', '#74add1', '#ffffbf', '#f46d43', '#a50026'], 
                                 vmin=vmin, vmax=vmax,
                                 caption='Land Surface Temperature (°C)')

    # Center map on the grid
    center_lat = df['latitude'].mean()
    center_lon = df['longitude'].mean()

    # --- RENDER DUAL MAPS ---
    map_col1, map_col2 = st.columns(2)

    with map_col1:
        st.subheader("🔥 Current Baseline (Pre-Monsoon)")
        m_base = folium.Map(location=[center_lat, center_lon], zoom_start=15, tiles="CartoDB dark_matter")
        
        for _, row in df.iterrows():
            folium.Rectangle(
                bounds=[[row['latitude']-0.00015, row['longitude']-0.00015], 
                        [row['latitude']+0.00015, row['longitude']+0.00015]],
                color=colormap(row['Baseline_Predicted_LST']),
                fill=True,
                fill_color=colormap(row['Baseline_Predicted_LST']),
                fill_opacity=0.7,
                weight=0
            ).add_to(m_base)
            
        colormap.add_to(m_base)
        st_folium(m_base, use_container_width=True, height=500, key="base_map")

    with map_col2:
        st.subheader("❄️ AI-Optimized Strategy Map")
        m_opt = folium.Map(location=[center_lat, center_lon], zoom_start=15, tiles="CartoDB dark_matter")
        
        for _, row in df.iterrows():
            # Draw base temperature pixel
            folium.Rectangle(
                bounds=[[row['latitude']-0.00015, row['longitude']-0.00015], 
                        [row['latitude']+0.00015, row['longitude']+0.00015]],
                color=colormap(row['Final_Mitigated_LST']),
                fill=True,
                fill_color=colormap(row['Final_Mitigated_LST']),
                fill_opacity=0.7,
                weight=0
            ).add_to(m_opt)

            # Overlay high-contrast interventions
            if row['Assigned_Intervention'] == 'Cool_Roof':
                folium.CircleMarker(
                    location=[row['latitude'], row['longitude']],
                    radius=4, color='black', weight=1,
                    fill=True, fill_color='white', fill_opacity=1.0,
                    tooltip=f"Cool Roof (-{row['Baseline_Predicted_LST'] - row['Final_Mitigated_LST']:.2f}°C)"
                ).add_to(m_opt)
            elif row['Assigned_Intervention'] == 'Urban_Greening':
                folium.CircleMarker(
                    location=[row['latitude'], row['longitude']],
                    radius=4, color='black', weight=1,
                    fill=True, fill_color='#00FF00', fill_opacity=1.0, # Bright neon green
                    tooltip=f"Tree Canopy (-{row['Baseline_Predicted_LST'] - row['Final_Mitigated_LST']:.2f}°C)"
                ).add_to(m_opt)

        colormap.add_to(m_opt)
        st_folium(m_opt, use_container_width=True, height=500, key="opt_map")

else:
    st.warning("Awaiting data execution...")

import ee
import geemap
import pandas as pd

def authenticate_and_initialize():
    """
    Authenticates and initializes the Earth Engine API.
    """
    print("Authenticating and initializing Earth Engine...")
    try:
        ee.Initialize()
    except Exception as e:
        ee.Authenticate()
        ee.Initialize()
    print("Earth Engine initialized successfully.")

def build_spatial_data_cube():
    """
    Constructs the Spatial Data Cube by pulling Landsat 8 and Sentinel-2 data,
    computing physical indices (LST, NDVI, NDBI, MNDWI), aligning to a 30m grid,
    and exporting the pixel data into a Pandas DataFrame.
    """
    # 1. Define Region of Interest (Pune Bounding Box)
    # Using the coordinates provided: [73.75, 18.45, 73.95, 18.65]
    roi = ee.Geometry.BBox(73.75, 18.45, 73.95, 18.65)
    
    # Pre-monsoon months (March to May)
    start_date = '2023-03-01'
    end_date = '2023-05-31'
    
    print(f"Fetching data for ROI from {start_date} to {end_date}...")

    # 2. Query Landsat 8 (Collection 2, Tier 1, Level 2) for LST
    # L2 Surface Temperature band is ST_B10
    l8_collection = (ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
                     .filterBounds(roi)
                     .filterDate(start_date, end_date)
                     .filter(ee.Filter.lt('CLOUD_COVER', 10)))
    
    l8_median = l8_collection.median()
    
    # Calculate Land Surface Temperature (LST) in Celsius
    # Scale factor for Landsat 8 C02 ST: (DN * 0.00341802) + 149.0 (yields Kelvin)
    # Then subtract 273.15 to convert to Celsius.
    lst = l8_median.select('ST_B10') \
        .multiply(0.00341802).add(149.0).subtract(273.15) \
        .rename('LST')

    # 3. Query Sentinel-2 for NDVI, NDBI, MNDWI
    s2_collection = (ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                     .filterBounds(roi)
                     .filterDate(start_date, end_date)
                     .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)))
    
    s2_median = s2_collection.median()
    
    # NDVI (Normalized Difference Vegetation Index): (NIR - Red) / (NIR + Red)
    # Sentinel-2: NIR is B8, Red is B4
    ndvi = s2_median.normalizedDifference(['B8', 'B4']).rename('NDVI')
    
    # NDBI (Normalized Difference Built-up Index): (SWIR1 - NIR) / (SWIR1 + NIR)
    # Sentinel-2: SWIR1 is B11, NIR is B8
    ndbi = s2_median.normalizedDifference(['B11', 'B8']).rename('NDBI')
    
    # MNDWI (Modified Normalized Difference Water Index): (Green - SWIR1) / (Green + SWIR1)
    # Sentinel-2: Green is B3, SWIR1 is B11
    mndwi = s2_median.normalizedDifference(['B3', 'B11']).rename('MNDWI')

    # 4. Combine all indices into a single image cube
    # Also add the pixel longitude and latitude to capture spatial coordinates per pixel
    data_cube = ee.Image([lst, ndvi, ndbi, mndwi]).addBands(ee.Image.pixelLonLat())

    # 5. Resample to a uniform 30-meter resolution on EPSG:32643
    print("Reprojecting and resampling to 30m grid (EPSG:32643)...")
    resampled_cube = data_cube.reproject(
        crs='EPSG:32643',
        scale=30
    )

    # 6. Extract pixel data into a structured Pandas DataFrame
    # Note: We sample the region using the resampled cube. 
    # For a 20x20km bounding box at 30m resolution, this will extract ~444k pixels.
    # We use a large numPixels limit to avoid truncation.
    print("Extracting multi-band pixel data to DataFrame (this may take a moment)...")
    sampled_features = resampled_cube.sample(
        region=roi,
        scale=30,
        projection='EPSG:32643',
        numPixels=1000000,
        geometries=False  # Lat/Lon already included via pixelLonLat()
    )
    
    # Convert Earth Engine FeatureCollection to Pandas DataFrame using geemap
    df = geemap.ee_to_pandas(sampled_features)
    
    # Reorder columns for clarity
    if not df.empty:
        cols = ['longitude', 'latitude', 'LST', 'NDVI', 'NDBI', 'MNDWI']
        # Only keep existing columns in case of missing bands
        cols = [c for c in cols if c in df.columns]
        df = df[cols]
        
    print(f"Data extraction complete! DataFrame shape: {df.shape}")
    return df

if __name__ == "__main__":
    # Ensure Earth Engine is authenticated
    authenticate_and_initialize()
    
    # Run pipeline
    df = build_spatial_data_cube()
    
    # Save to a local CSV for ML Phase 2
    output_csv = "pune_spatial_data_cube_30m.csv"
    df.to_csv(output_csv, index=False)
    print(f"Data successfully saved to {output_csv}")

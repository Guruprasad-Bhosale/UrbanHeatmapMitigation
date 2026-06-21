import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { tempToColor } from '@/lib/climate-utils';

const SpatialGrid = ({ data, isOptimized }) => {
  if (!data || data.length === 0) {
    return <div className="text-muted-foreground animate-pulse py-10">Loading map data...</div>;
  }

  // Calculate center of the map
  const centerLat = data.reduce((acc, curr) => acc + curr.latitude, 0) / data.length;
  const centerLon = data.reduce((acc, curr) => acc + curr.longitude, 0) / data.length;

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-border" style={{ zIndex: 0 }}>
      <MapContainer 
        center={[centerLat, centerLon]} 
        zoom={16} 
        style={{ height: '100%', width: '100%', minHeight: '400px', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {data.map((pixel, idx) => {
          const temp = isOptimized ? pixel.Final_Mitigated_LST : pixel.Baseline_Predicted_LST;
          const color = tempToColor(temp);
          
          return (
            <CircleMarker
              key={idx}
              center={[pixel.latitude, pixel.longitude]}
              radius={5} // Fixed 5px radius for visibility at city scale
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.9,
                weight: 1 // thin border for distinction
              }}
            >
              <Tooltip sticky>
                <div className="text-xs text-black">
                  <strong>{temp.toFixed(2)}°C</strong><br/>
                  Lat: {pixel.latitude.toFixed(5)}<br/>
                  Lon: {pixel.longitude.toFixed(5)}
                  {pixel.Assigned_Intervention && pixel.Assigned_Intervention !== 'None' && (
                    <><br/><span className="text-blue-600 font-semibold">{pixel.Assigned_Intervention}</span></>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default SpatialGrid;

import React from 'react';
import { Layers, Settings } from 'lucide-react';

const Sidebar = ({ isOptimized, setIsOptimized }) => {
  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col h-full overflow-y-auto z-10 shadow-2xl">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="text-blue-400" />
          Pune Mitigation
        </h1>
        <p className="text-slate-400 text-sm mb-6">Phase 5.3 React SPA Deliverable</p>

        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Settings size={16} /> Map State
            </h2>
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 relative overflow-hidden">
              <div 
                className={`absolute inset-y-1 w-[calc(50%-4px)] rounded bg-gradient-to-r transition-all duration-300 ease-out shadow-lg ${
                  isOptimized ? 'left-[calc(50%+2px)] from-blue-600 to-blue-500' : 'left-1 from-orange-600 to-orange-500'
                }`}
              />
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors relative z-10 ${!isOptimized ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setIsOptimized(false)}
              >
                🔥 Baseline
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors relative z-10 ${isOptimized ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setIsOptimized(true)}
              >
                ❄️ Optimized
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Intervention Legend</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-800 transition-colors">
                <div className="w-4 h-4 mt-0.5 bg-white rounded-full border border-black shadow-[0_0_12px_rgba(255,255,255,0.8)] shrink-0"></div>
                <div>
                  <div className="text-slate-200 font-medium text-sm mb-1">Cool Roofs</div>
                  <div className="text-slate-400 text-xs leading-relaxed">Increases Albedo (+0.3). Deflects Shortwave Radiation.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-800 transition-colors">
                <div className="w-4 h-4 mt-0.5 bg-[#00FF00] rounded-full border border-black shadow-[0_0_12px_rgba(0,255,0,0.8)] shrink-0"></div>
                <div>
                  <div className="text-slate-200 font-medium text-sm mb-1">Urban Greening</div>
                  <div className="text-slate-400 text-xs leading-relaxed">Increases NDVI (+0.4). Dissipates Latent Heat via Evapotranspiration.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import { Thermometer, ThermometerSnowflake, TrendingDown, Target } from 'lucide-react';

const KPICards = ({ data, isOptimized }) => {
  if (!data || data.length === 0) return null;

  const avgBase = data.reduce((acc, curr) => acc + curr.Baseline_Predicted_LST, 0) / data.length;
  const avgMitigated = data.reduce((acc, curr) => acc + curr.Final_Mitigated_LST, 0) / data.length;
  
  let maxDrop = 0;
  let interventions = 0;
  
  data.forEach(pixel => {
    const drop = pixel.Baseline_Predicted_LST - pixel.Final_Mitigated_LST;
    if (drop > maxDrop) maxDrop = drop;
    if (pixel.Assigned_Intervention === 'Cool_Roof' || pixel.Assigned_Intervention === 'Urban_Greening') {
      interventions++;
    }
  });

  const avgDrop = avgBase - avgMitigated;

  const Card = ({ title, value, sub, icon: Icon, colorClass }) => (
    <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700 shadow-xl flex items-start gap-4 transition-transform hover:-translate-y-1">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <div className="text-slate-400 text-sm font-medium mb-1">{title}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {sub && <div className="text-xs font-medium mt-1 text-emerald-400">{sub}</div>}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <Card 
        title="Baseline Avg LST" 
        value={`${avgBase.toFixed(2)} °C`} 
        icon={Thermometer} 
        colorClass="bg-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
      />
      <Card 
        title={isOptimized ? "Mitigated Avg LST" : "Target Mitigated LST"} 
        value={`${avgMitigated.toFixed(2)} °C`} 
        sub={`City-wide Drop: -${avgDrop.toFixed(2)} °C`}
        icon={ThermometerSnowflake} 
        colorClass="bg-blue-500/20 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
      />
      <Card 
        title="Peak Localized Drop" 
        value={`-${maxDrop.toFixed(2)} °C`} 
        icon={TrendingDown} 
        colorClass="bg-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
      />
      <Card 
        title="Budget Utilized" 
        value={`${interventions} Pixels`} 
        sub="Strict 10% Municipal Quota"
        icon={Target} 
        colorClass="bg-purple-500/20 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
      />
    </div>
  );
};

export default KPICards;

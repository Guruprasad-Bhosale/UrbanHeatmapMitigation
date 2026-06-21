'use client'

import { dashboardMetrics } from '@/lib/mockData'
import { formatNumber } from '@/lib/climate-utils'
import { useData } from '@/contexts/DataContext'

export default function CommandCenterHeader() {
  const { isOptimized, setIsOptimized } = useData()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">AI</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">UrbanHeatAI</h1>
            <p className="text-xs text-muted-foreground">Pune Metropolitan Region</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          {/* Toggle for baseline/optimized */}
          <div className="flex items-center gap-3">
             <span className={`font-semibold ${!isOptimized ? 'text-orange-400' : 'text-muted-foreground'}`}>Baseline</span>
             <button 
                onClick={() => setIsOptimized(!isOptimized)}
                className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${isOptimized ? 'bg-primary' : 'bg-slate-600'}`}
             >
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${isOptimized ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
             <span className={`font-semibold ${isOptimized ? 'text-primary' : 'text-muted-foreground'}`}>Optimized</span>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="flex flex-col gap-1 text-right">
            <div className="text-muted-foreground">AI Confidence</div>
            <div className="text-sm font-semibold text-primary">
              {dashboardMetrics.aiConfidence}%
            </div>
          </div>
          
          <div className="h-8 w-px bg-border" />
          
          <div className="flex flex-col gap-1 text-right">
            <div className="text-muted-foreground">Status</div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-accent">Complete</span>
            </div>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="flex flex-col gap-1 text-right">
            <div className="text-muted-foreground">Pixels Processed</div>
            <div className="text-sm font-semibold text-primary">
              {formatNumber(dashboardMetrics.pixelsProcessed)}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

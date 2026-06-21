'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { useData } from '@/contexts/DataContext'
import SpatialGrid from '../SpatialGrid'

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isHovering, setIsHovering] = useState(false)
  const sliderRef = useRef<HTMLInputElement>(null)
  
  const { data, loading } = useData()

  let avgBase = 0;
  let avgMitigated = 0;
  let maxDrop = 0;

  if (data && data.length > 0) {
    avgBase = data.reduce((acc, curr) => acc + curr.Baseline_Predicted_LST, 0) / data.length;
    avgMitigated = data.reduce((acc, curr) => acc + curr.Final_Mitigated_LST, 0) / data.length;
    data.forEach((pixel: any) => {
      const drop = pixel.Baseline_Predicted_LST - pixel.Final_Mitigated_LST;
      if (drop > maxDrop) maxDrop = drop;
    });
  }
  const avgDrop = avgBase - avgMitigated;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Heat Map Comparison
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to compare before and after optimization
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Cooling Impact</p>
          <p className="text-2xl font-bold text-accent">
            ↓ {avgDrop.toFixed(1)}°C
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-xl border border-border/50 bg-card p-6"
      >
        <div className="relative overflow-x-auto">
          <div className="flex gap-8 pb-4">
            {/* Before Grid */}
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Before Optimization
              </p>
              <p className="text-xs text-muted-foreground mb-2">{avgBase.toFixed(1)}°C Average</p>
              <div className="p-2 rounded bg-background/50">
                {loading ? <div className="text-muted-foreground animate-pulse py-10">Loading map...</div> : <SpatialGrid data={data} isOptimized={false} />}
              </div>
            </div>

            {/* After Grid */}
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                After Optimization
              </p>
              <p className="text-xs text-muted-foreground mb-2">{avgMitigated.toFixed(1)}°C Average</p>
              <div className="p-2 rounded bg-background/50">
                {loading ? <div className="text-muted-foreground animate-pulse py-10">Loading map...</div> : <SpatialGrid data={data} isOptimized={true} />}
              </div>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="mt-6 space-y-3">
          <motion.div
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            className="relative"
          >
            <input
              ref={sliderRef}
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-destructive via-yellow-500 to-green-500 rounded-lg appearance-none cursor-pointer transition-all hover:h-3"
              style={{
                background: `linear-gradient(to right, #FF1744 0%, #FFC400 50%, #00FF88 100%)`,
              }}
            />
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isHovering ? 1 : 0,
                y: isHovering ? -30 : 10,
              }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold whitespace-nowrap"
              style={{
                left: `calc(${sliderPosition}% + 0px)`,
              }}
            >
              {sliderPosition}% Cooling Impact
            </motion.div>
          </motion.div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Before</span>
            <span className="text-primary font-semibold">{sliderPosition}%</span>
            <span>After</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

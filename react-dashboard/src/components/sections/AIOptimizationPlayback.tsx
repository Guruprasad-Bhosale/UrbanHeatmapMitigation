'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Play, Pause } from 'lucide-react'

interface PlaybackStep {
  label: string
  description: string
  delay: number
}

const playbackSteps: PlaybackStep[] = [
  { label: 'Heat Map Loaded', description: 'Thermal data acquired', delay: 0 },
  { label: 'Hotspots Detected', description: '5 critical zones identified', delay: 1 },
  {
    label: 'Root Causes Analyzed',
    description: 'Vegetation deficit, density factors',
    delay: 2,
  },
  {
    label: 'Trees Planted',
    description: '45,000 trees across zones',
    delay: 3,
  },
  {
    label: 'Cool Roofs Applied',
    description: '82,000 sq meters treated',
    delay: 4,
  },
  {
    label: 'Cooling Achieved',
    description: '-3.1°C temperature reduction',
    delay: 5,
  },
]

export default function AIOptimizationPlayback() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)

  const handlePlay = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    let step = 0
    const interval = setInterval(() => {
      step += 1
      if (step >= playbackSteps.length) {
        clearInterval(interval)
        setIsPlaying(false)
      } else {
        setCurrentStep(step)
      }
    }, 1500)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            AI Optimization Playback
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Watch how AI transforms the cityscape through strategic interventions
          </p>
        </div>
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Optimization
            </>
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        {/* Timeline visualization */}
        <div className="space-y-3">
          {playbackSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: currentStep >= idx ? 1 : 0.3,
                scale: currentStep === idx ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg border transition-all ${
                currentStep === idx
                  ? 'border-primary bg-primary/10'
                  : currentStep > idx
                    ? 'border-green-700/50 bg-green-900/10'
                    : 'border-border/30 bg-background/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === idx
                      ? 'bg-primary text-primary-foreground animate-pulse'
                      : currentStep > idx
                        ? 'bg-green-600 text-white'
                        : 'bg-muted'
                  }`}
                >
                  {currentStep > idx ? '✓' : idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Results summary */}
        {currentStep === playbackSteps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/50"
          >
            <p className="text-sm font-semibold text-accent mb-2">
              Optimization Complete!
            </p>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground">Temperature Drop</p>
                <p className="font-bold text-lg text-accent">-3.1°C</p>
              </div>
              <div>
                <p className="text-muted-foreground">People Benefited</p>
                <p className="font-bold text-lg text-accent">84,000</p>
              </div>
              <div>
                <p className="text-muted-foreground">Budget Invested</p>
                <p className="font-bold text-lg text-accent">₹18 Cr</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, X, Volume2, VolumeX } from 'lucide-react'

interface GuideStep {
  id: string
  title: string
  description: string
  target?: string // Element ID to highlight
  position: 'top' | 'bottom' | 'left' | 'right'
  audioScript?: string
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to UrbanHeatAI',
    description:
      'This guided demo will show you how AI-powered urban heat management can protect your city. Let\'s explore the key features.',
    position: 'bottom',
    audioScript:
      'Welcome to UrbanHeatAI. This guided demo will show you how AI-powered urban heat management can protect your city.',
  },
  {
    id: 'header',
    title: 'Command Center Header',
    description:
      'Track real-time AI confidence levels, processing status, and the scale of satellite data analysis. Our AI is currently 94% confident.',
    target: 'command-header',
    position: 'bottom',
    audioScript:
      'This is the Command Center Header. You can see the AI confidence level, processing status, and the number of pixels processed.',
  },
  {
    id: 'impact',
    title: 'Impact Summary',
    description:
      'See the potential impact of our optimization strategy: a 2.9°C temperature reduction protecting 84,000 people.',
    target: 'impact-card',
    position: 'bottom',
    audioScript:
      'The Impact Summary shows the potential outcome: a 2.9 degree temperature reduction protecting 84,000 people across 14 priority zones.',
  },
  {
    id: 'visualization',
    title: 'City-Wide Impact Visualization',
    description:
      'This animated visualization shows the before and after thermal patterns. Watch how strategic interventions cool urban hotspots.',
    target: 'city-viz',
    position: 'bottom',
    audioScript:
      'This visualization shows the thermal patterns before and after optimization. You can see how strategic interventions cool the urban hotspots.',
  },
  {
    id: 'slider',
    title: 'Before & After Comparison',
    description:
      'Drag the slider to see the detailed heat map transformation. Red zones are hot, blue zones are cool.',
    target: 'slider-section',
    position: 'bottom',
    audioScript:
      'You can drag this slider to see the detailed heat map transformation. Red zones indicate high temperatures, blue zones are cool.',
  },
  {
    id: 'playback',
    title: 'AI Optimization Playback',
    description:
      'Watch the step-by-step process of how AI identifies problems and implements solutions. Each step takes seconds, but achieves months of analysis.',
    target: 'playback-section',
    position: 'bottom',
    audioScript:
      'This timeline shows the AI optimization process. Each step represents a phase: loading satellite data, detecting hotspots, analyzing root causes, and implementing solutions.',
  },
  {
    id: 'kpi',
    title: 'Mission Control Metrics',
    description:
      'Track six critical performance indicators showing the project\'s health, impact, and ROI across your city.',
    target: 'kpi-cards',
    position: 'top',
    audioScript:
      'These are the six Mission Control metrics that track project health, impact, and return on investment.',
  },
  {
    id: 'projection',
    title: '2030 Projections',
    description:
      '"No Action" vs "UrbanHeatAI Strategy": See what happens without intervention versus with our AI-powered approach.',
    target: 'projection-section',
    position: 'top',
    audioScript:
      'These projections show the future: what happens if no action is taken versus the outcome with the UrbanHeatAI strategy.',
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    description:
      'You now understand the UrbanHeatAI dashboard. Use the tabs above to explore Analysis, Simulation, and Recommendations. Click "Done" to close this guide.',
    position: 'bottom',
    audioScript:
      'You now have a complete understanding of the UrbanHeatAI dashboard. Use the tabs to explore more detailed analysis and recommendations.',
  },
]

interface JudgeModeProps {
  isOpen: boolean
  onClose: () => void
}

export default function JudgeMode({ isOpen, onClose }: JudgeModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const step = GUIDE_STEPS[currentStep]

  useEffect(() => {
    if (!isOpen) return

    // Auto-play audio if available
    if (soundEnabled && window.speechSynthesis && step.audioScript) {
      const utterance = new SpeechSynthesisUtterance(step.audioScript)
      utterance.rate = 0.95
      utterance.pitch = 1
      setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }

    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [currentStep, isOpen, soundEnabled, step.audioScript])

  const handleNext = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getHighlightPosition = () => {
    if (!step.target) return null

    const element = document.getElementById(step.target)
    if (!element) return null

    const rect = element.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
  }

  const highlight = getHighlightPosition()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Highlight spotlight */}
          {highlight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-40 pointer-events-none"
              style={{
                top: highlight.top - 8,
                left: highlight.left - 8,
                width: highlight.width + 16,
                height: highlight.height + 16,
                border: '2px solid #00D9FF',
                borderRadius: '12px',
                boxShadow: '0 0 0 2000px rgba(0, 0, 0, 0.4)',
              }}
            />
          )}

          {/* Guide card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 max-w-md bg-card border border-primary/50 rounded-lg shadow-2xl"
            style={{
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {/* Progress indicator */}
            <div className="flex gap-1 px-6 pt-4">
              {GUIDE_STEPS.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`h-1 flex-1 rounded-full ${
                    idx === currentStep
                      ? 'bg-primary'
                      : idx < currentStep
                        ? 'bg-accent'
                        : 'bg-muted'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.05 }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-foreground mb-4 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Audio script preview */}
              {step.audioScript && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs text-muted-foreground italic mb-4 p-2 bg-background rounded border border-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Volume2 className="w-3 h-3 text-accent" />
                    <span>Audio narration</span>
                  </div>
                </motion.div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all text-sm font-semibold"
                  >
                    {currentStep === GUIDE_STEPS.length - 1 ? (
                      'Done'
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  title={soundEnabled ? 'Mute audio' : 'Enable audio'}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  title="Close guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step indicator */}
              <div className="text-xs text-muted-foreground text-center mt-3">
                Step {currentStep + 1} of {GUIDE_STEPS.length}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

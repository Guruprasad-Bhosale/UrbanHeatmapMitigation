'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function CityWideImpactViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = 80

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw before circle (outer ring - red, before optimization)
    const beforeProgress = Math.min(animationProgress, 0.5) / 0.5
    ctx.beginPath()
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2 * beforeProgress)
    ctx.strokeStyle = '#FF1744'
    ctx.lineWidth = 20
    ctx.lineCap = 'round'
    ctx.stroke()

    // Draw after circle (inner ring - green, after optimization)
    if (animationProgress > 0.5) {
      const afterProgress = (animationProgress - 0.5) / 0.5
      const afterRadius = maxRadius * 0.5 * afterProgress
      ctx.beginPath()
      ctx.arc(centerX, centerY, Math.max(10, afterRadius), 0, Math.PI * 2)
      ctx.fillStyle = '#00FF88'
      ctx.fill()
    }

    // Draw center text
    ctx.font = 'bold 32px sans-serif'
    ctx.fillStyle = '#00D9FF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('-2.9°C', centerX, centerY - 20)

    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#94A3B8'
    ctx.fillText('Temperature Reduction', centerX, centerY + 20)
  }, [animationProgress])

  useEffect(() => {
    let frame = 0
    const interval = setInterval(() => {
      frame += 1
      setAnimationProgress(Math.min(frame / 100, 1))
    }, 16)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 rounded-xl bg-card border border-red-900/30"
      >
        <p className="text-xs text-muted-foreground mb-2">Before Optimization</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-destructive">100%</p>
          <p className="text-sm text-muted-foreground">at-risk population</p>
        </div>
      </motion.div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full h-auto"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="p-6 rounded-xl bg-card border border-green-900/30"
      >
        <p className="text-xs text-muted-foreground mb-2">After Optimization</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-accent">24%</p>
          <p className="text-sm text-muted-foreground">at-risk population</p>
        </div>
      </motion.div>
    </div>
  )
}

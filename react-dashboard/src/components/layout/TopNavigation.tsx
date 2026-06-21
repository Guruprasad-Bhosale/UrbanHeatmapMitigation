'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { TabType } from '@/lib/types'
import { cn } from '@/lib/utils'
import JudgeMode from '../sections/JudgeMode'

interface TopNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function TopNavigation({
  activeTab,
  onTabChange,
}: TopNavigationProps) {
  const [showJudgeMode, setShowJudgeMode] = useState(false)

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'analysis', label: 'ANALYSIS' },
    { id: 'simulation', label: 'SIMULATION' },
    { id: 'recommendations', label: 'RECOMMENDATIONS' },
  ]

  return (
    <nav className="sticky top-[65px] z-30 border-b border-border bg-background/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'pb-2 text-xs font-semibold tracking-wider transition-all duration-200',
                  'border-b-2 relative',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute inset-x-0 -bottom-1 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowJudgeMode(true)}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/50 hover:border-primary transition-all duration-200 text-xs font-semibold text-primary hover:text-accent"
          >
            <Play className="w-3 h-3 group-hover:animate-pulse" />
            Start Guided Demo
          </button>
        </div>
      </div>

      {/* Judge Mode */}
      <JudgeMode isOpen={showJudgeMode} onClose={() => setShowJudgeMode(false)} />
    </nav>
  )
}

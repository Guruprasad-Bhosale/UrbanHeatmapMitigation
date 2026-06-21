'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { TabType } from '@/lib/types'
import TopNavigation from './TopNavigation'
import CommandCenterHeader from './CommandCenterHeader'
import OverviewTab from '../tabs/OverviewTab'
import AnalysisTab from '../tabs/AnalysisTab'
import SimulationTab from '../tabs/SimulationTab'
import RecommendationsTab from '../tabs/RecommendationsTab'
import AIAssistant from '../ai/AIAssistant'

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab key="overview" />
      case 'analysis':
        return <AnalysisTab key="analysis" />
      case 'simulation':
        return <SimulationTab key="simulation" />
      case 'recommendations':
        return <RecommendationsTab key="recommendations" />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div id="command-header">
        <CommandCenterHeader />
      </div>
      <TopNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="relative">
        <AnimatePresence mode="wait">
          {renderTab()}
        </AnimatePresence>
      </main>
      <AIAssistant />
    </div>
  )
}

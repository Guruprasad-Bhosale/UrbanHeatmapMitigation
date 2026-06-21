'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Send, MessageCircle, Loader2 } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
}

const quickReplies = [
  'What are the priority zones?',
  'How much will this cost?',
  'What is the expected cooling impact?',
  'How long will implementation take?',
]

const aiResponses: { [key: string]: string } = {
  'priority zones': 'The top priority zones are: 1) Shivajinagar (Risk: 92/100), 2) Pimpri (Risk: 88/100), and 3) Hinjewadi (Risk: 84/100). These areas show the highest heat stress and population vulnerability.',
  'cost': 'The total investment required is ₹35 Crore across all three phases. Phase 1 (Cool Roofs): ₹8 Cr, Phase 2 (Urban Greening): ₹15 Cr, Phase 3 (Water Bodies): ₹12 Cr.',
  'cooling impact': 'The AI-optimized strategy is projected to reduce urban heat by 5.8°C across all priority zones, protecting approximately 222,000 people from heat stress.',
  'implementation': 'The full implementation timeline is 18 months: Phase 1 (0-6 months), Phase 2 (6-12 months), Phase 3 (12-18 months).',
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I am UrbanHeatAI Assistant. Ask me about the cooling strategy, interventions, costs, or timeline. How can I help?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickReply = (reply: string) => {
    addMessage(reply, 'user')
    setTimeout(() => {
      const lowerReply = reply.toLowerCase()
      let response = 'I understand your question. Based on the analysis, here\'s what I recommend...'
      
      for (const [key, value] of Object.entries(aiResponses)) {
        if (lowerReply.includes(key)) {
          response = value
          break
        }
      }
      
      addMessage(response, 'assistant')
    }, 600)
  }

  const addMessage = (content: string, type: 'user' | 'assistant') => {
    setIsLoading(true)
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
    }
    setMessages((prev) => [...prev, newMessage])
    setInput('')
    
    if (type === 'user') {
      setTimeout(() => setIsLoading(false), 400)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    addMessage(input, 'user')
    
    setTimeout(() => {
      const lowerInput = input.toLowerCase()
      let response = 'That\'s a great question! Based on the UrbanHeatAI analysis, I recommend consulting the detailed strategy cards above for comprehensive information.'
      
      for (const [key, value] of Object.entries(aiResponses)) {
        if (lowerInput.includes(key)) {
          response = value
          break
        }
      }
      
      addMessage(response, 'assistant')
      setIsLoading(false)
    }, 800)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-shadow z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 w-96 h-96 rounded-lg bg-card border border-border/50 shadow-2xl flex flex-col z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
              <h3 className="font-semibold text-foreground text-sm">
                UrbanHeatAI Assistant
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Ask me about the cooling strategy
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-3 py-2 text-xs ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-background text-foreground border border-border/50 rounded-bl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  AI is thinking...
                </motion.div>
              )}
            </div>

            {/* Quick Replies or Input */}
            <div className="border-t border-border/50 p-3 space-y-2">
              {messages.length === 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply) => (
                    <motion.button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-xs p-2 rounded-lg bg-background border border-border/50 text-foreground hover:border-primary/50 transition-colors text-left line-clamp-2"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-2 py-1.5 rounded-lg text-xs bg-background border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

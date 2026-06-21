'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputValue.trim()) {
      sendMessage({ text: inputValue })
      setInputValue('')
    }
  }

  const getMessageText = (message: any): string => {
    if (!message.parts || !Array.isArray(message.parts)) return ''
    return message.parts
      .filter((p: any): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p: any) => p.text)
      .join('')
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => {
          setIsOpen(!isOpen)
          setIsMinimized(false)
        }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
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
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] rounded-xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-semibold">UrbanHeatAI Assistant</h3>
                <p className="text-xs opacity-90">Intelligent heat mitigation guidance</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <MessageCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Ask me about urban heat mitigation strategies, cooling interventions, or analysis insights.
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-card border border-border text-foreground rounded-bl-none'
                          }`}
                        >
                          {getMessageText(message)}
                        </div>
                      </motion.div>
                    ))
                  )}
                  {status === 'streaming' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-card border border-border px-4 py-2 rounded-lg rounded-bl-none">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form
                  onSubmit={onSubmit}
                  className="border-t border-border p-4 bg-background flex gap-2"
                >
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about heat mitigation..."
                    disabled={status === 'streaming'}
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground disabled:opacity-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={status === 'streaming' || !inputValue.trim()}
                    className="px-3 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

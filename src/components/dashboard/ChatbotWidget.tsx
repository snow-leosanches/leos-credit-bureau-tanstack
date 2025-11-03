import { X, MessageCircle, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface ChatbotWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatbotWidget({ isOpen, onClose }: ChatbotWidgetProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      type: 'bot' as const,
      text: "Hi! I noticed you've been browsing. How can I help you today?",
      timestamp: new Date(),
    },
    {
      id: 2,
      type: 'bot' as const,
      text: "I can help you with:\n• Credit monitoring services\n• Identity protection plans\n• Understanding your credit score\n• Subscription upgrades",
      timestamp: new Date(),
    },
  ])

  if (!isOpen) return null

  const handleSend = () => {
    if (!message.trim()) return

    const newUserMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      text: message,
      timestamp: new Date(),
    }

    const botResponse = {
      id: messages.length + 2,
      type: 'bot' as const,
      text: "Thank you for your interest! A member of our team will be with you shortly. In the meantime, feel free to explore our premium features!",
      timestamp: new Date(),
    }

    setMessages([...messages, newUserMessage, botResponse])
    setMessage('')
  }

  const handleQuickAction = (action: string) => {
    const quickMessages: Record<string, string> = {
      upgrade: "I'd like to upgrade my subscription",
      identity: "Tell me about identity protection",
      score: "How can I improve my credit score?",
    }

    const userMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      text: quickMessages[action],
      timestamp: new Date(),
    }

    const botResponses: Record<string, string> = {
      upgrade: "Great choice! Our Premium plan includes 24/7 credit monitoring, identity theft protection, and personalized score improvement tips for just $29.99/month. Would you like to learn more?",
      identity: "Our Identity Protection service includes dark web monitoring, $1M identity theft insurance, and dedicated fraud resolution specialists. It's included in our Premium plan at $29.99/month.",
      score: "I can help with that! Key factors include payment history (35%), credit utilization (30%), and length of credit history (15%). Our Premium plan includes personalized action plans. Interested?",
    }

    const botMessage = {
      id: messages.length + 2,
      type: 'bot' as const,
      text: botResponses[action],
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage, botMessage])
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-96 mb-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Credit Bureau Assistant</h3>
              <p className="text-cyan-100 text-xs">Online • Here to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === 'user'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.type === 'user' ? 'text-cyan-100' : 'text-gray-400'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {messages.length === 2 && (
          <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700">
            <p className="text-gray-400 text-xs mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickAction('upgrade')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-200 text-xs rounded-full transition-colors"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => handleQuickAction('identity')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-200 text-xs rounded-full transition-colors"
              >
                Identity Protection
              </button>
              <button
                onClick={() => handleQuickAction('score')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-200 text-xs rounded-full transition-colors"
              >
                Improve Score
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-slate-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Bubble Button (shown when closed) */}
      {!isOpen && (
        <button
          onClick={() => {}}
          className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  )
}

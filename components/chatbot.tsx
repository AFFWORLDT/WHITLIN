"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollAnimate } from "@/components/scroll-animate"

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const quickQuestions = [
  "What products do you offer?",
  "How can I place an order?",
  "What are your shipping options?",
  "Do you offer bulk discounts?"
]

const botResponses: Record<string, string> = {
  "products": "We offer a wide range of premium hospitality linen including bed linen (sheets, duvets, duvet covers), bath linen (towels, bathrobes), and FnB linen. All our products are made from 100% organic cotton for bed linen and 100% Egyptian cotton for bath linen.",
  "order": "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. For bulk orders or B2B inquiries, please contact us at info@whitlin.com or call +971 54 438 9849.",
  "shipping": "We offer shipping across the UAE and internationally. Shipping costs and delivery times vary based on your location. For specific shipping inquiries, please contact our customer service team.",
  "discount": "Yes! We offer special discounts for bulk orders and B2B clients. Please contact us at info@whitlin.com with your requirements, and our team will provide you with a customized quote.",
  "default": "Thank you for your interest in Whitlin! For detailed information, please contact us at info@whitlin.com or call +971 54 438 9849. Our team is available Sunday-Thursday, 9 AM - 6 PM GST."
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to help you with any questions about Whitlin's premium hospitality linen products. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('product') || lowerMessage.includes('offer') || lowerMessage.includes('what')) {
      return botResponses.products
    } else if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
      return botResponses.order
    } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('ship')) {
      return botResponses.shipping
    } else if (lowerMessage.includes('discount') || lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('bulk')) {
      return botResponses.discount
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
      return "You can reach us at:\n📧 Email: info@whitlin.com\n📞 Phone: +971 54 438 9849, +971 50 396 1541\n📍 Address: WHITLIN (1st Floor) - 231 Al Ittihad Rd - Al Qusais - Al Nahda 1 - Dubai\n\nBusiness Hours: Sunday-Thursday, 9 AM - 6 PM GST"
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Welcome to Whitlin. How can I help you today?"
    } else {
      return botResponses.default
    }
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot thinking
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Get bot response
    const botResponse = getBotResponse(messageText)
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)

    // If user asks about contact, offer to create a lead
    if (messageText.toLowerCase().includes('contact') || messageText.toLowerCase().includes('quote') || messageText.toLowerCase().includes('inquiry')) {
      setTimeout(() => {
        const leadOffer: Message = {
          id: (Date.now() + 2).toString(),
          text: "Would you like me to connect you with our sales team? I can help you submit an inquiry form.",
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, leadOffer])
      }, 2000)
    }
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'hidden' : 'animate-bounce'
        }`}
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col animate-scale-in border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Whitlin Assistant</h3>
                <p className="text-xs text-white/80">We're here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </div>
            )}
            
            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Need immediate help? Call +971 54 438 9849
            </p>
          </div>
        </div>
      )}
    </>
  )
}


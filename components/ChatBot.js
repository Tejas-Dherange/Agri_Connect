"use client"

import { useState, useRef, useEffect } from "react"

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello! I'm your agricultural assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Sample responses for demo purposes
  const dummyResponses = [
    "Based on your description, this sounds like aphid infestation. Try using neem oil spray as an organic solution.",
    "For tomato plants, I recommend watering deeply 2-3 times a week rather than daily shallow watering.",
    "The yellowing leaves could indicate a nitrogen deficiency. Consider applying a balanced fertilizer.",
    "This season, market trends show higher prices for organic produce. Consider transitioning some crops to organic methods.",
    "Based on current weather patterns, you might want to delay planting for another week to avoid frost damage.",
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Select a random response for demo
      const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)]

      // Add assistant response
      setMessages((prev) => [...prev, { role: "system", content: randomResponse }])
      setIsLoading(false)
    }, 1000)

    // In a real implementation, you would call the OpenAI API here
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: input }),
    // })
    // const data = await response.json()
    // setMessages(prev => [...prev, { role: 'system', content: data.message }])
    // setIsLoading(false)
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <div className="bg-green-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Chat with Agricultural Expert</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === "user" ? "bg-green-100 text-gray-800" : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block p-3 rounded-lg bg-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}


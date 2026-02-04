'use client'

import { useState, useEffect, useRef } from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User } from "lucide-react"

interface Message {
    id: string
    sender_id: string
    content: string
    created_at: string
}

export default function ChatWindow({
    conversationId,
    initialMessages,
    currentUserId,
    chatTitle = "Counselor"
}: {
    conversationId: string,
    initialMessages: Message[],
    currentUserId: string,
    chatTitle?: string
}) {
    const [messages, setMessages] = useState(initialMessages)
    const [input, setInput] = useState("")
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Sync with server props when they change (e.g. after revalidate)
    useEffect(() => {
        setMessages(initialMessages)
    }, [initialMessages])

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        // Feature disabled
        console.log("Chat feature disabled")
        setInput("")
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] border rounded-xl bg-gray-50 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{chatTitle}</h3>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
                            Online
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                ? 'bg-primary text-white rounded-tr-sm'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                                }`}>
                                <p>{msg.content}</p>
                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    )
                })}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Send className="w-5 h-5 text-gray-300" />
                        </div>
                        <p className="text-sm">Start the conversation...</p>
                        <p className="text-xs max-w-xs text-center">Your messages are private and confidential.</p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-2 items-center">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
                <Button type="submit" disabled={sending || !input.trim()} size="icon" className="rounded-full h-10 w-10 shrink-0">
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    )
}

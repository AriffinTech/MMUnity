'use client'

import { useState } from 'react'
import { addComment } from '@/app/actions'
import { Send, Loader2 } from 'lucide-react'

export default function CommentForm({ postId }: { postId: string }) {
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)
        const result = await addComment(postId, content)
        setIsSubmitting(false)

        if (result?.success) {
            setContent('')
        } else {
            alert('Failed to post comment')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-start mt-6">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a supportive reply..."
                className="flex-1 min-h-[80px] p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
            />
            <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
        </form>
    )
}

'use client'

import { useState } from 'react'
import { createPost } from '@/app/actions'
import { Send, Loader2, PenLine } from 'lucide-react'

export default function CreatePostForm() {
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)
        const result = await createPost(content)
        setIsSubmitting(false)

        if (result?.success) {
            setContent('')
            setIsExpanded(false)
            alert('Your concern has been shared anonymously.')
        } else {
            alert('Failed to share concern')
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 transition-all">
            {!isExpanded ? (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full text-left text-gray-500 bg-gray-50 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition-colors"
                >
                    <PenLine className="w-5 h-5" />
                    <span>What's on your mind? Share anonymously...</span>
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Share your concern
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="I'm feeling..."
                        className="w-full min-h-[120px] p-4 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-base mb-4"
                        autoFocus
                    />
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Post
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

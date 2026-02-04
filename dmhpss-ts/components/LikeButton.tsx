'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

import { cn } from '@/lib/utils'

interface LikeButtonProps {
    postId: string
    initialLikes: number
    initialLiked: boolean
}

export default function LikeButton({ postId, initialLikes, initialLiked }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes)
    const [liked, setLiked] = useState(initialLiked)
    const [loading, setLoading] = useState(false)

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Feature disabled
        console.log("Like feature disabled")
    }

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "flex items-center gap-1 text-xs transition-colors",
                liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            )}
        >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            <span>{likes}</span>
        </button>
    )
}

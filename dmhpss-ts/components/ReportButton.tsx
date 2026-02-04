'use client'

import { useState } from 'react'
import { createReport } from '@/app/actions'
import { Flag, Loader2 } from 'lucide-react'

export default function ReportButton({ targetId, type }: { targetId: string, type: 'post' | 'comment' }) {
    const [isReporting, setIsReporting] = useState(false)
    const [reported, setReported] = useState(false)

    const handleReport = async () => {
        if (!confirm('Are you sure you want to report this content as inappropriate?')) return

        setIsReporting(true)
        // Hardcoded reason for this simple implementation
        const result = await createReport(targetId, type, 'Inappropriate content')
        setIsReporting(false)

        if (result?.success) {
            setReported(true)
            alert('Thank you. The content has been reported for review.')
        } else {
            alert('Failed to submit report. Please try again.')
        }
    }

    if (reported) {
        return <span className="text-xs text-red-500 font-medium">Reported</span>
    }

    return (
        <button
            onClick={handleReport}
            disabled={isReporting}
            className="text-zinc-400 hover:text-red-500 transition-colors p-1"
            title="Report inappropriate content"
        >
            {isReporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
        </button>
    )
}

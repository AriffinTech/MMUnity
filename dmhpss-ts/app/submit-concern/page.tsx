'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Send } from "lucide-react"
import Link from 'next/link'
import { createPost } from '@/app/actions'

export default function SubmitConcernPage() {
    const router = useRouter()
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)
        const result = await createPost(content)

        if (result.error) {
            alert(result.error)
            setIsSubmitting(false)
        } else {
            router.push('/student')
            router.refresh()
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl min-h-screen flex flex-col justify-center">
            <Link href="/student" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors w-fit">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <Card className="shadow-lg border-primary/10">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-gray-900">Submit a Concern</CardTitle>
                    <CardDescription>
                        Share your situation with a counselor. This conversation is private and confidential.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">How can we help?</label>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="I'm feeling overwhelmed..."
                                className="min-h-[200px] resize-none text-base p-4 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            disabled={isSubmitting || !content.trim()}
                        >
                            {isSubmitting ? "Submitting..." : (
                                <span className="flex items-center gap-2">
                                    <Send className="w-4 h-4" /> Submit to Counselor
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { Post } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const columns = ["New", "In Progress", "Resolved"]

interface CaseBoardProps {
    posts: Post[]
}

export function CaseBoard({ posts }: CaseBoardProps) {
    const getSeverity = (content: string) => {
        const lower = content.toLowerCase()
        if (lower.includes("die") || lower.includes("suicide") || lower.includes("kill") || lower.includes("harm")) return "High"
        if (lower.includes("hurt") || lower.includes("pain") || lower.includes("sad")) return "Medium"
        return "Low"
    }

    const calculateDuration = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        if (hours < 1) return "< 1h waiting"
        if (hours < 24) return `${hours}h waiting`
        return `${Math.floor(hours / 24)}d waiting`
    }

    const mapStatusToColumn = (status: string) => {
        if (status === 'open') return 'New'
        if (status === 'pending') return 'In Progress'
        if (status === 'resolved') return 'Resolved'
        return 'New'
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {columns.map((col) => (
                <div key={col} className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-text-main px-2">{col}</h3>
                    <div className="flex-1 rounded-3xl bg-secondary/10 p-4 space-y-4 min-h-[500px]">
                        {posts
                            .filter((post) => mapStatusToColumn(post.case_status) === col)
                            .map((post) => {
                                const severity = getSeverity(post.content)
                                return (
                                    <Link key={post.id} href={`/posts/${post.id}`}>
                                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                            <CardHeader className="p-4 pb-2">
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-base truncate">Anonymous</CardTitle>
                                                    <Badge
                                                        variant={
                                                            severity === "High"
                                                                ? "destructive" // Changed to valid shadcn variant
                                                                : severity === "Medium"
                                                                    ? "secondary"
                                                                    : "outline"
                                                        }
                                                        className={
                                                            severity === "High" ? "bg-red-100 text-red-800 hover:bg-red-200" :
                                                                severity === "Medium" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                                                                    "bg-green-100 text-green-800 hover:bg-green-200"
                                                        }
                                                    >
                                                        {severity}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2 text-sm text-muted-foreground">
                                                <p className="line-clamp-2 mb-2">{post.content}</p>
                                                <div className="flex items-center gap-1 mt-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{calculateDuration(post.created_at)}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                )
                            })}
                    </div>
                </div>
            ))}
        </div>
    )
}

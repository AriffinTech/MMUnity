"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { dismissReport, deleteReportedContent } from "@/app/actions"
import { useRouter } from "next/navigation"

export interface ReportItem {
    id: string
    reason: string
    post_id: string | null
    comment_id: string | null
    status: string
    contentPreview: string
    created_at: string
}

interface ReportQueueProps {
    reports: ReportItem[]
}

export function ReportQueue({ reports }: ReportQueueProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState<string | null>(null)

    const handleDismiss = async (reportId: string) => {
        setIsLoading(reportId)
        const result = await dismissReport(reportId)
        setIsLoading(null)
        if (result.error) alert(result.error)
        else router.refresh()
    }

    const handleDelete = async (report: ReportItem) => {
        if (!confirm("Are you sure you want to delete this content?")) return

        setIsLoading(report.id)
        const type = report.post_id ? 'post' : 'comment'
        const contentId = report.post_id || report.comment_id

        if (!contentId) return

        const result = await deleteReportedContent(report.id, type, contentId)
        setIsLoading(null)
        if (result.error) alert(result.error)
        else router.refresh()
    }

    return (
        <div className="w-full overflow-hidden rounded-3xl border bg-white shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-secondary/30 text-text-main font-semibold">
                    <tr>
                        <th className="p-4">Reason</th>
                        <th className="p-4">Content Preview</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {reports.map((report) => (
                        <tr
                            key={report.id}
                            className="hover:bg-gray-50/50"
                        >
                            <td className="p-4 font-medium">
                                <Badge variant="outline" className="mr-2">{report.status}</Badge>
                                {report.reason}
                            </td>
                            <td className="p-4 text-muted-foreground truncate max-w-[200px]">
                                {report.contentPreview}
                            </td>
                            <td className="p-4">
                                <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                    {report.post_id ? 'Post' : 'Comment'}
                                </span>
                            </td>
                            <td className="p-4 text-xs text-muted-foreground">
                                {new Date(report.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={isLoading === report.id}
                                    onClick={() => handleDismiss(report.id)}
                                >
                                    Ignore
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={isLoading === report.id}
                                    onClick={() => handleDelete(report)}
                                >
                                    Delete Content
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {reports.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                No pending reports. Good job!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

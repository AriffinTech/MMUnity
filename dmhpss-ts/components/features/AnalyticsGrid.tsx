"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalyticsProps {
    chartData: { label: string; value: number }[]
    activeSessions: number
    reportsResolved: number
}

export function AnalyticsGrid({ chartData, activeSessions, reportsResolved }: AnalyticsProps) {
    const maxValue = Math.max(...chartData.map((d) => d.value)) || 1

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between h-64 gap-2 pt-4">
                        {chartData.map((d) => (
                            <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
                                <div
                                    className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/80"
                                    style={{ height: `${(d.value / maxValue) * 100}%` }}
                                />
                                <span className="text-xs font-medium text-muted-foreground">
                                    {d.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Placeholder for another chart or metric */}
            <Card>
                <CardHeader>
                    <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Server Uptime</span>
                        <span className="text-green-600 font-bold">99.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Active Sessions (24h)</span>
                        <span className="font-bold">{activeSessions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Reports Resolved</span>
                        <span className="font-bold">{reportsResolved}%</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

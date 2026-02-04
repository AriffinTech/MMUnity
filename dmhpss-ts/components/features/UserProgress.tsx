"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"

interface UserProgressProps {
    profile: {
        level: number
        points: number
    }
    streak?: number
}

export function UserProgress({ profile, streak = 0 }: UserProgressProps) {
    const { level, points } = profile
    const nextLevelXP = level * 100
    const progressValue = (points / nextLevelXP) * 100

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Your Progress</CardTitle>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                    Level {level}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{points} XP</span>
                        <span>{nextLevelXP} XP</span>
                    </div>
                    <Progress value={progressValue} className="h-3" />
                </div>
                <div className="flex items-center gap-2 text-orange-500 font-semibold bg-orange-50 px-3 py-2 rounded-xl w-fit">
                    <Flame className="h-5 w-5 fill-orange-500" />
                    <span>{streak} Day Streak!</span>
                </div>
            </CardContent>
        </Card>
    )
}

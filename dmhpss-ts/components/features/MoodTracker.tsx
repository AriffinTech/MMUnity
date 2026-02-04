"use client"

import * as React from "react"
import { Smile, Frown, Meh, Angry } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const moods = [
    { icon: Angry, label: "Angry", color: "text-red-500", value: "angry" },
    { icon: Frown, label: "Sad", color: "text-blue-500", value: "sad" },
    { icon: Meh, label: "Neutral", color: "text-yellow-500", value: "neutral" },
    { icon: Smile, label: "Happy", color: "text-green-500", value: "happy" },
    { icon: Smile, label: "Excited", color: "text-purple-500", value: "excited" },
]

import { saveMood } from "@/app/actions"

export function MoodTracker() {
    const [selectedMood, setSelectedMood] = React.useState<string | null>(null)
    const [note, setNote] = React.useState("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleMoodClick = (moodValue: string) => {
        setSelectedMood(moodValue)
        setIsDialogOpen(true)
    }

    const handleSubmit = async () => {
        if (!selectedMood) return
        setIsSubmitting(true)

        // Map mood string to 1-5 rating (simple mapping)
        const ratingMap: Record<string, number> = {
            "angry": 1,
            "sad": 2,
            "neutral": 3,
            "happy": 4,
            "excited": 5
        }

        const result = await saveMood(ratingMap[selectedMood], note)

        setIsSubmitting(false)
        setIsDialogOpen(false)

        if (result?.success) {
            alert("Mood logged! You earned 10 XP.")
            setNote("")
            setSelectedMood(null)
        } else {
            alert("Failed to log mood.")
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>How are you feeling today?</CardTitle>
                <CardDescription>Select an icon that represents your mood.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-around py-4">
                {moods.map((mood) => (
                    <Button
                        key={mood.value}
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                        onClick={() => handleMoodClick(mood.value)}
                    >
                        <mood.icon className={`h-8 w-8 ${mood.color}`} />
                    </Button>
                ))}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a note (optional)</DialogTitle>
                            <DialogDescription>
                                Would you like to write down why you feel this way?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Input
                                placeholder="I feel this way because..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Skip
                            </Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Log"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

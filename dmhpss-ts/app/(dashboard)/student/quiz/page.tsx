"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { saveQuizResult } from "@/app/actions"
import { Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const QUESTIONS = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself - or that you are a failure?",
    "Trouble concentrating on things?",
    "Moving or speaking so slowly that others could have noticed?",
    "Thoughts that you would be better off dead or of hurting yourself?"
]

const OPTIONS = [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 }
]

export default function QuizPage() {
    const router = useRouter()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(-1))
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [score, setScore] = useState(0)

    const handleOptionSelect = (value: number) => {
        const newAnswers = [...answers]
        newAnswers[currentQuestion] = value
        setAnswers(newAnswers)

        // Auto-advance if not the last question
        if (currentQuestion < QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQuestion(curr => curr + 1), 250)
        }
    }

    const calculateScore = () => {
        return answers.reduce((acc, curr) => acc + (curr > -1 ? curr : 0), 0)
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        const totalScore = calculateScore()
        const maxScore = QUESTIONS.length * 3

        try {
            await saveQuizResult(totalScore, maxScore)
            setScore(totalScore)
            setIsCompleted(true)
        } catch (error) {
            console.error("Failed to save quiz:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getRecommendation = (score: number) => {
        if (score <= 4) return "Your score suggests minimal depression. Keep maintaining your mental wellness!"
        if (score <= 9) return "Your score suggests mild depression. Consider monitoring your feelings and self-care."
        if (score <= 14) return "Your score suggests moderate depression. It might be helpful to reach out to a counselor."
        if (score <= 19) return "Your score suggests moderately severe depression. We strongly recommend talking to a professional."
        return "Your score suggests severe depression. Please seek help from a healthcare provider immediately."
    }

    if (isCompleted) {
        return (
            <div className="container max-w-2xl mx-auto py-10 px-4">
                <Card className="w-full border-2 border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Assessment Completed</CardTitle>
                        <CardDescription>Thank you for checking in on your mental health.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center p-6 bg-secondary/10 rounded-xl">
                            <div className="text-4xl font-bold text-primary mb-2">{score} / {QUESTIONS.length * 3}</div>
                            <p className="text-muted-foreground font-medium">Your Score</p>
                        </div>

                        <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                            <h3 className="font-semibold mb-2">Recommendation:</h3>
                            <p className="text-sm leading-relaxed">{getRecommendation(score)}</p>
                        </div>

                        <div className="flex justify-center gap-4 pt-4">
                            <Button variant="outline" onClick={() => router.push('/student')}>
                                Return to Dashboard
                            </Button>
                            <Button onClick={() => router.push('/counselor')}>
                                Find a Counselor
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Mental Health Check-in
                </h1>
                <p className="text-muted-foreground">
                    Over the last 2 weeks, how often have you been bothered by any of the following problems?
                </p>
            </div>

            <Card className="w-full min-h-[400px] flex flex-col justify-between shadow-xl">
                <CardHeader>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                        <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                        <span>{Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                        />
                    </div>
                </CardHeader>

                <CardContent className="flex-1 py-8">
                    <h2 className="text-xl md:text-2xl font-medium text-center leading-relaxed">
                        {QUESTIONS[currentQuestion]}
                    </h2>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                        {OPTIONS.map((option) => (
                            <Button
                                key={option.value}
                                variant={answers[currentQuestion] === option.value ? "default" : "outline"}
                                className={cn(
                                    "h-12 text-base justify-start px-6 transition-all hover:scale-[1.02]",
                                    answers[currentQuestion] === option.value ? "ring-2 ring-offset-2 ring-primary" : ""
                                )}
                                onClick={() => handleOptionSelect(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex justify-between w-full mt-6 pt-6 border-t">
                        <Button
                            variant="ghost"
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(curr => curr - 1)}
                        >
                            Previous
                        </Button>

                        {currentQuestion === QUESTIONS.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={answers[currentQuestion] === -1 || isSubmitting}
                                className="min-w-[120px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Submit Assessment"
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setCurrentQuestion(curr => curr + 1)}
                                disabled={answers[currentQuestion] === -1}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

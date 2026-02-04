"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Quote, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function MotivationalTip({ tip }: { tip: { text: string, author: string } }) {
    if (!tip) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-200/50 hover:shadow-lg transition-all duration-300 dark:border-indigo-500/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                        <Sparkles className="h-5 w-5 text-amber-400" />
                        Daily Inspiration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6">
                        <Quote className="h-4 w-4 absolute top-0 left-0 text-indigo-400 opacity-50 transform -scale-x-100" />
                        <p className="text-sm font-medium leading-relaxed italic text-black">
                            {tip.text}
                        </p>
                        <p className="text-xs text-right mt-3 font-semibold text-indigo-600 dark:text-indigo-400">
                            — {tip.author}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

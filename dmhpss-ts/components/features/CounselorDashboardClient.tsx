'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CaseBoard } from "@/components/features/CaseBoard"
import { Post } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MessageSquare, Clock, User, ChevronRight } from "lucide-react"

interface Conversation {
    id: string
    student_id: string
    status: string
    created_at: string
    last_message?: string
}

interface CounselorDashboardClientProps {
    posts: Post[]
    conversations: Conversation[]
}

export function CounselorDashboardClient({ posts, conversations }: CounselorDashboardClientProps) {
    return (
        <Tabs defaultValue="community" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Counselor Dashboard</h1>
                    <p className="text-muted-foreground">Manage community safety and private support requests.</p>
                </div>
                <TabsList>
                    <TabsTrigger value="community">Community Cases</TabsTrigger>
                    <TabsTrigger value="messages">Private Requests ({conversations.length})</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="community" className="flex-1 mt-0">
                <CaseBoard posts={posts} />
            </TabsContent>

            <TabsContent value="messages" className="flex-1 mt-0">
                <div className="grid gap-4">
                    {conversations.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                                <p>No active private requests.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        conversations.map((conv) => (
                            <Link key={conv.id} href={`/messages/${conv.id}`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-base font-medium flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            Student Request
                                        </CardTitle>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(conv.created_at).toLocaleDateString()}
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>
                                                        {new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <span>•</span>
                                                <span className={`capitalize ${conv.status === 'active' ? 'text-green-600 font-medium' : ''}`}>
                                                    {conv.status}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </TabsContent>
        </Tabs>
    )
}

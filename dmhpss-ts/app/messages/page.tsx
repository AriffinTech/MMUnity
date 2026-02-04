import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MessageSquare, Plus, Clock, ChevronRight, ArrowLeft } from "lucide-react"

export default async function MessagesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch existing conversations
    // Note: detailed schema for this query depends on user running the provided SQL
    const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto p-6 max-w-4xl min-h-screen">
            <div className="mb-6">
                <Link href="/student" className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors bg-white w-fit px-3 py-1.5 rounded-full shadow-sm border">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Counselor Chat</h1>
                    <p className="text-gray-500">Private, confidential conversations with our support team.</p>
                </div>
                <form action={async () => {
                    'use server'
                    const sb = await createClient()
                    const { data: { user } } = await sb.auth.getUser()
                    if (!user) return

                    const { data, error } = await sb
                        .from('conversations')
                        .insert({ student_id: user.id })
                        .select()
                        .single()

                    if (data) {
                        redirect(`/messages/${data.id}`)
                    }
                }}>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Session
                    </Button>
                </form>
            </div>

            <div className="grid gap-4">
                {conversations?.map((chat) => (
                    <Link key={chat.id} href={`/messages/${chat.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {chat.status === 'active' ? 'Active Session' : 'Closed Session'}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            Started {new Date(chat.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {(!conversations || conversations.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            Start a new session to connect with a counselor. All chats are private and secure.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

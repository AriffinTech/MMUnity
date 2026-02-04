import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ChatWindow from '@/components/ChatWindow'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ConversationPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch conversation details to verify access
    const { data: conversation } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .single()

    // Simple authorization: Must be the student OR a counselor/admin
    // For now, checking if student_id matches user. If not, check if user is counselor.
    // Authorization & Role Detection
    const isStudentOwner = conversation?.student_id === user.id

    // Check if user is staff (counselor/admin) based on profile
    // We do this to verify access if they are NOT the student owner
    let isStaff = false
    let fetchedRole = 'undefined'

    // Always fetch profile to check role, for debug, and for force-counselor-view logic
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    fetchedRole = profile?.role || 'undefined'

    if (profile?.role === 'counselor' || profile?.role === 'admin') {
        isStaff = true
    }

    const hasAccess = isStudentOwner || isStaff
    // Force counselor view if I am staff OR if I am not the student owner
    // This handles the dev case where I created the ticket but am now logged in as counselor
    const isCounselorView = isStaff || !isStudentOwner

    if (!conversation || !hasAccess) return notFound()

    // Fetch initial messages
    const { data: messages } = await supabase
        .from('direct_messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true })

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-4xl min-h-screen flex flex-col">
            <div className="mb-4">
                <Link href={isCounselorView ? "/counselor" : "/messages"} className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {isCounselorView ? "Back to Dashboard" : "Back to All Chats"}
                </Link>
            </div>
            <ChatWindow
                conversationId={id}
                initialMessages={messages || []}
                currentUserId={user.id}
                chatTitle={isCounselorView ? "Student" : "Counselor"}
            />
        </div>
    )
}

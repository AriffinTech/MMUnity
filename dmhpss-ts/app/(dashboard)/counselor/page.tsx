import { CounselorDashboardClient } from "@/components/features/CounselorDashboardClient"
import { Button } from "@/components/ui/button"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CounselorDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch all posts efficiently (only fields needed for board)
    const { data: posts } = await supabase
        .from('posts')
        .select(`
            id,
            content,
            case_status,
            created_at,
            user_id,
            title
        `)
        .order('created_at', { ascending: false })

    // Fetch all private conversations
    const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <CounselorDashboardClient
            posts={posts || []}
            conversations={conversations || []}
        />
    )
}

import { ReportQueue, ReportItem } from "@/components/features/ReportQueue"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ModeratorDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'moderator' && profile?.role !== 'admin') {
        redirect('/')
    }

    // Fetch reports with related content
    const { data: rawReports } = await supabase
        .from('reports')
        .select(`
            id,
            reason,
            status,
            created_at,
            post_id,
            comment_id,
            posts ( content ),
            comments ( content )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    // Map to normalized data structure
    const reports: ReportItem[] = (rawReports || []).map((r: any) => {
        let contentPreview = "N/A"
        if (r.posts?.content) contentPreview = r.posts.content
        if (r.comments?.content) contentPreview = r.comments.content // Override if comment

        return {
            id: r.id,
            reason: r.reason,
            status: r.status,
            post_id: r.post_id,
            comment_id: r.comment_id,
            created_at: r.created_at,
            contentPreview
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-main">Moderation Queue</h1>
                    <p className="text-muted-foreground">Review and action reported content.</p>
                </div>
            </div>

            <ReportQueue reports={reports} />
        </div>
    )
}

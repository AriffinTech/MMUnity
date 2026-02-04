import { AnalyticsGrid } from "@/components/features/AnalyticsGrid"
import { UserManagementTable } from "@/components/features/UserManagementTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Check if admin OR counselor (since we allowed counselors to access for testing)
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // Verify requesting user is admin
    if (profile?.role !== 'admin') {
        redirect('/')
    }

    // Fetch all users
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    // --- Analytics Fetching ---

    // 1. Reports Stats
    const { data: reports } = await supabase.from('reports').select('status')
    const totalReports = reports?.length || 0
    const resolvedReports = reports?.filter(r => r.status === 'resolved').length || 0
    const resolvedRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0

    // 2. Active Sessions (Unique users in last 24h via posts/moods)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString()

    // Fetch recent posts
    const { data: recentPosts } = await supabase
        .from('posts')
        .select('user_id, created_at')
        .gte('created_at', yesterdayStr)

    // Fetch recent mood logs
    const { data: recentMoods } = await supabase
        .from('mood_logs')
        .select('user_id')
        .gte('created_at', yesterdayStr)

    // Combine unique user IDs
    const activeUserIds = new Set([
        ...(recentPosts?.map(p => p.user_id) || []),
        ...(recentMoods?.map(m => m.user_id) || [])
    ])
    const activeSessions = activeUserIds.size

    // 3. Chart Data (Posts over last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: weeklyPosts } = await supabase
        .from('posts')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true })

    // Process into labels (Mon, Tue) and values
    const chartData: { label: string; key: string; value: number }[] = []
    const daysMap = new Map<string, number>()

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const label = d.toLocaleDateString('en-US', { weekday: 'short' }) // e.g., Mon
        const key = d.toDateString() // Full date string for grouping
        if (!daysMap.has(key)) {
            chartData.push({ label, key, value: 0 }) // push ordered
        }
    }

    // Fill counts
    weeklyPosts?.forEach(post => {
        const d = new Date(post.created_at).toDateString()
        const target = chartData.find(c => c.key === d)
        if (target) target.value++
    })

    // Remove key before passing
    const finalChartData = chartData.map(c => ({ label: c.label, value: c.value }))


    return (
        <div className="space-y-6 h-full flex flex-col">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
                <p className="text-muted-foreground">System analytics and user management.</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6 flex-1 flex flex-col">
                <TabsList>
                    <TabsTrigger value="overview">Analytics Overview</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <AnalyticsGrid
                        chartData={finalChartData}
                        activeSessions={activeSessions}
                        reportsResolved={resolvedRate}
                    />
                </TabsContent>

                <TabsContent value="users" className="flex-1">
                    <UserManagementTable users={users || []} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

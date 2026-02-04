import { MoodTracker } from "@/components/features/MoodTracker"
import { UserProgress } from "@/components/features/UserProgress"
import { MotivationalTip } from "@/components/features/MotivationalTip"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Headphones, MessageSquare, ClipboardList } from "lucide-react"
import { motivationalTips } from "@/lib/motivational-content"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LikeButton from "@/components/LikeButton"

export default async function StudentDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Calculate daily tip
    const today = new Date()
    const start = new Date(today.getFullYear(), 0, 0)
    const diff = (today.getTime() - start.getTime()) + ((start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000)
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    const tipIndex = dayOfYear % motivationalTips.length
    const dailyTip = motivationalTips[tipIndex]

    if (!user) {
        redirect('/login')
    }

    const { data: posts } = await supabase
        .from('posts')
        .select(`
            *,
            comments (count),
            post_likes (count)
        `)
        .order('created_at', { ascending: false })
        .limit(6)

    // Check which posts are liked by current user
    let likedPostIds = new Set<string>()
    if (posts && posts.length > 0) {
        const { data: myLikes } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('user_id', user.id)
            .in('post_id', posts.map(p => p.id))

        if (myLikes) {
            myLikes.forEach(l => likedPostIds.add(l.post_id))
        }
    }

    // Fetch user profile for progress
    const { data: profile } = await supabase
        .from('profiles')
        .select('level, points')
        .eq('id', user.id)
        .single()

    // Calculate Streak
    // Fetch unique dates of mood logs
    const { data: moodLogs } = await supabase
        .from('mood_logs')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    let streak = 0
    if (moodLogs && moodLogs.length > 0) {
        const uniqueDays = Array.from(new Set(moodLogs.map(log =>
            new Date(log.created_at).toISOString().split('T')[0]
        )))

        // Check continuity
        if (uniqueDays.length > 0) {
            const today = new Date().toISOString().split('T')[0]
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

            // Streak must start today or yesterday to be active
            if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
                streak = 1
                for (let i = 0; i < uniqueDays.length - 1; i++) {
                    const current = new Date(uniqueDays[i])
                    const next = new Date(uniqueDays[i + 1])
                    const diffTime = Math.abs(current.getTime() - next.getTime())
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                    if (diffDays === 1) {
                        streak++
                    } else {
                        break
                    }
                }
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Mood & Progress */}
                <div className="w-full md:w-1/3 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-text-main">Daily Check-in</h2>
                        <MoodTracker />
                    </section>

                    <section>
                        <UserProgress profile={profile || { level: 1, points: 0 }} streak={streak} />
                    </section>

                    <section>
                        <MotivationalTip tip={dailyTip} />
                    </section>

                    <section>
                        <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-lg">Self Assessment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Take a quick check-in to see how you're doing mentally.
                                </p>
                                <Button asChild className="w-full">
                                    <a href="/student/quiz">Take Assessment</a>
                                </Button>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                    Submit a Concern
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Have a private issue? Submit a concern directly to our counselors.
                                </p>
                                <Button className="w-full gap-2" asChild>
                                    <Link href="/submit-concern">
                                        <ClipboardList className="h-4 w-4" />
                                        Submit Concern
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Right Column: Peer Feed */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-text-main">Peer Support Feed</h2>
                        <Link href="/peer-support">
                            <Button variant="outline" className="rounded-2xl">New Post</Button>
                        </Link>
                    </div>

                    {/* Masonry Grid Layout */}
                    <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                        {posts?.map((post) => (
                            <Card key={post.id} className="break-inside-avoid mb-4 hover:shadow-md transition-shadow">
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-primary">Anonymous</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <p className="text-sm leading-relaxed">{post.content}</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex gap-4 text-muted-foreground">
                                    <div className="flex items-center gap-1 text-xs transition-colors">
                                        <LikeButton
                                            postId={post.id}
                                            initialLikes={post.post_likes?.[0]?.count || 0}
                                            initialLiked={likedPostIds.has(post.id)}
                                        />
                                    </div>
                                    <Link href={`/posts/${post.id}`} className="flex items-center gap-1 text-xs hover:text-blue-500 transition-colors">
                                        <MessageCircle className="h-4 w-4" /> {post.comments[0]?.count || 0}
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                        {posts?.length === 0 && (
                            <div className="col-span-full text-center py-8 text-muted-foreground">
                                No posts yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Heart } from 'lucide-react'
import CreatePostForm from '@/components/CreatePostForm'
import ReportButton from '@/components/ReportButton'

import LikeButton from "@/components/LikeButton"

export default async function PeerSupportPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch all posts (ordered by latest)
    const { data: posts } = await supabase
        .from('posts')
        .select(`
            *,
            comments (count),
            post_likes (count)
        `)
        .order('created_at', { ascending: false })

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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <header className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Peer Support Community</h1>
                    <p className="text-gray-500">
                        A safe space to share, connect, and support each other. You are not alone.
                    </p>
                </header>

                <CreatePostForm />

                <div className="space-y-6">
                    {posts?.map((post) => (
                        <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                        AN
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Anonymous</p>
                                        <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <ReportButton targetId={post.id} type="post" />
                            </div>

                            <Link href={`/posts/${post.id}`}>
                                <p className="text-gray-800 leading-relaxed mb-4 line-clamp-3 hover:text-primary transition-colors">
                                    {post.content}
                                </p>
                            </Link>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4">
                                    <LikeButton
                                        postId={post.id}
                                        initialLikes={post.post_likes?.[0]?.count || 0}
                                        initialLiked={likedPostIds.has(post.id)}
                                    />
                                    <Link
                                        href={`/posts/${post.id}`}
                                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{post.comments[0]?.count || 0} Comments</span>
                                    </Link>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${post.case_status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {post.case_status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {posts?.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No posts yet. Be the first to share.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

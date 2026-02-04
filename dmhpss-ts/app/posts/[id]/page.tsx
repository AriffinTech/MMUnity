import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import CommentForm from '@/components/CommentForm'
import ReportButton from '@/components/ReportButton'
import { updateCaseStatus } from '@/app/actions'

export default async function PostPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    // Awaits params.id access
    const { id } = await params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch user role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const canManage = profile?.role === 'counselor' || profile?.role === 'admin'

    // Fetch post
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !post) return notFound()

    // Fetch comments
    const { data: comments } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href={canManage ? "/counselor" : "/peer-support"}
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Feed
                    </Link>

                    {canManage && post.case_status === 'open' && (
                        <form action={async () => {
                            'use server'
                            await updateCaseStatus(id, 'resolved')
                        }}>
                            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm">
                                Mark as Resolved
                            </button>
                        </form>
                    )}
                </div>

                {/* Post Content */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-bold text-primary">?</span>
                            </div>
                            <div>
                                <h1 className="text-sm font-medium text-gray-500">Anonymous Student</h1>
                                <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full 
                            ${post.case_status === 'open' ? 'bg-orange-100 text-orange-700' :
                                post.case_status === 'resolved' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'}`}>
                            {post.case_status}
                        </span>
                        <div className="ml-2">
                            <ReportButton targetId={post.id} type="post" />
                        </div>
                    </div>
                    <p className="text-xl leading-relaxed text-gray-800">
                        {post.content}
                    </p>
                </div>

                {/* Discussion Thread */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold mb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3>Discussion</h3>
                    </div>

                    <div className="space-y-4">
                        {comments?.map((comment) => (
                            <div key={comment.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-gray-700 mb-3">{comment.content}</p>
                                <div className="flex justify-between items-center text-xs text-gray-400">
                                    <span>Peer/Counselor</span>
                                    <span>{new Date(comment.created_at).toLocaleString()}</span>
                                    <ReportButton targetId={comment.id} type="comment" />
                                </div>
                            </div>
                        ))}
                        {comments?.length === 0 && (
                            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-500">No responses yet. Be the first to offer support.</p>
                            </div>
                        )}
                    </div>

                    <CommentForm postId={id} />
                </div>
            </div>
        </div>
    )
}

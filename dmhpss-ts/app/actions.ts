'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getAuthenticatedUser, requireRole } from '@/utils/auth-helpers'

export async function saveMood(rating: number, note?: string) {
    const supabase = await createClient()
    const user = await getAuthenticatedUser()
    const fallbackUser = user || { id: '11111111-1111-1111-1111-111111111111' }

    const { error } = await supabase
        .from('mood_logs')
        .insert({
            user_id: fallbackUser.id,
            rating,
            note: note || null,
        })

    if (error) {
        console.error('Error saving mood:', error)
        return { error: 'Failed to save mood' }
    }

    // Award points (10)
    await supabase.rpc('update_user_points', { user_uuid: fallbackUser.id, points_to_add: 10 })
    console.log(`[Mood] Saved rating ${rating} for User ${fallbackUser.id}`)

    revalidatePath('/')
    return { success: true }
}

export async function updateUserRole(userId: string, newRole: 'user' | 'counselor' | 'moderator' | 'admin') {
    const supabase = await createClient()

    const { authorized, error: authError } = await requireRole(['admin'])
    if (!authorized) return { error: authError }

    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    if (error) {
        console.error('Error updating role:', error)
        return { error: 'Failed to update role' }
    }

    revalidatePath('/admin')
    console.log(`[Admin] User ${userId} promoted to ${newRole}`)
    return { success: true }
}

export async function deleteUser(userId: string) {
    const supabase = await createClient()

    const { authorized, error: authError } = await requireRole(['admin'])
    if (!authorized) return { error: authError }

    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

    if (error) {
        console.error('Error deleting user:', error)
        return { error: 'Failed to delete user' }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function updateCaseStatus(postId: string, newStatus: 'open' | 'pending' | 'resolved') {
    const supabase = await createClient()

    const { authorized, error: authError } = await requireRole(['counselor', 'moderator', 'admin'])
    if (!authorized) return { error: authError }

    const { error } = await supabase
        .from('posts')
        .update({ case_status: newStatus })
        .eq('id', postId)

    if (error) {
        console.error('Error updating case status:', error)
        return { error: 'Failed to update status' }
    }

    revalidatePath('/moderator')
    revalidatePath('/counselor')
    console.log(`[Case] Case ${postId} status updated to: ${newStatus}`)
    return { success: true }
}

export async function addComment(postId: string, content: string) {
    const supabase = await createClient()
    const user = await getAuthenticatedUser()
    const fallbackUser = user || { id: '11111111-1111-1111-1111-111111111111' }

    const { error } = await supabase
        .from('comments')
        .insert({
            post_id: postId,
            user_id: fallbackUser.id,
            content,
        })

    if (error) {
        console.error('Error adding comment:', error)
        return { error: 'Failed to add comment' }
    }

    revalidatePath(`/posts/${postId}`)
    console.log(`[Comment] New comment on post ${postId}`)
    return { success: true }
}

export async function createReport(targetId: string, type: 'post' | 'comment', reason: string) {
    const supabase = await createClient()
    const user = await getAuthenticatedUser()
    const fallbackUser = user || { id: '11111111-1111-1111-1111-111111111111' }

    const payload: any = {
        reporter_id: fallbackUser.id,
        reason,
    }

    if (type === 'post') {
        payload.post_id = targetId
    } else {
        payload.comment_id = targetId
    }

    const { error } = await supabase
        .from('reports')
        .insert(payload)

    if (error) {
        console.error('Error creating report:', error)
        return { error: 'Failed to create report' }
    }

    console.log(`[Report] New report filed against ${type} ${targetId}`)
    return { success: true }
}

export async function saveQuizResult(score: number, maxScore: number) {
    const supabase = await createClient()
    const user = await getAuthenticatedUser()
    const fallbackUser = user || { id: '11111111-1111-1111-1111-111111111111' }

    const { error } = await supabase
        .from('quiz_results')
        .insert({
            user_id: fallbackUser.id,
            score,
            max_score: maxScore,
        })

    if (error) {
        console.error('Error saving quiz result:', error)
        return { error: 'Failed to save quiz result' }
    }

    revalidatePath('/quiz')
    return { success: true }
}

export async function createPost(content: string) {
    const supabase = await createClient()
    const user = await getAuthenticatedUser()
    const fallbackUser = user || { id: '11111111-1111-1111-1111-111111111111' }

    if (!content.trim()) return { error: 'Content cannot be empty' }

    const { error } = await supabase
        .from('posts')
        .insert({
            user_id: fallbackUser.id,
            content,
            case_status: 'open',
        })

    if (error) {
        console.error('Error creating post:', error)
        return { error: 'Failed to create post' }
    }

    // Award points for sharing concern (5 points)
    await supabase.rpc('update_user_points', { user_uuid: fallbackUser.id, points_to_add: 5 })

    revalidatePath('/peer-support')
    revalidatePath('/counselor')
    console.log(`[Post] New concern submitted: "${content.substring(0, 20)}..."`)
    return { success: true }
}





export async function dismissReport(reportId: string) {
    const supabase = await createClient()

    const { authorized, error: authError } = await requireRole(['moderator', 'admin'])
    if (!authorized) return { error: authError }

    const { error } = await supabase
        .from('reports')
        .update({ status: 'resolved', admin_notes: 'Ignored by moderator' })
        .eq('id', reportId)

    if (error) {
        console.error('Error dismissing report:', error)
        return { error: 'Failed' }
    }

    revalidatePath('/moderator')
    console.log(`[Moderation] Report ${reportId} dismissed`)
    return { success: true }
}

export async function deleteReportedContent(reportId: string, type: 'post' | 'comment', contentId: string) {
    const supabase = await createClient()

    const { authorized, error: authError } = await requireRole(['moderator', 'admin'])
    if (!authorized) return { error: authError }

    // Delete content
    const table = type === 'post' ? 'posts' : 'comments'
    const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', contentId)

    if (deleteError) {
        console.error('Error deleting content:', deleteError)
        return { error: 'Failed to delete content' }
    }

    // Mark report resolved
    await supabase
        .from('reports')
        .update({ status: 'resolved', admin_notes: 'Content deleted by moderator' })
        .eq('id', reportId)

    revalidatePath('/moderator')
    console.log(`[Moderation] Content ${contentId} deleted due to report ${reportId}`)
    return { success: true }
}

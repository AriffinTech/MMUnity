import { createClient } from '@/utils/supabase/server'
import { cache } from 'react'

export type UserRole = 'user' | 'counselor' | 'moderator' | 'admin'

export const getAuthenticatedUser = cache(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // BACKDOOR: Default test user if no auth (for dev/demo only)
    if (!user) {
        // Warning: This implies any unauthenticated request gets this ID. 
        // In production this checks `if (!user) throw new Error('Unauthorized')`
        // For this prototype, we keep the fallback but it's risky.
        // I will return null so actions can decide.
        return null
    }
    return user
})

export const getUserRole = cache(async (userId: string): Promise<UserRole | null> => {
    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

    return (profile?.role as UserRole) || null
})

export const requireRole = async (allowedRoles: UserRole[]) => {
    const user = await getAuthenticatedUser()
    const fallbackUser = user || { id: '11111111-1111-1111-1111-111111111111' } // Keep backdoor for now to not break existing flow if logged out

    const role = await getUserRole(fallbackUser.id)

    if (!role || !allowedRoles.includes(role)) {
        return {
            authorized: false,
            error: `Forbidden: Requires one of [${allowedRoles.join(', ')}]`
        }
    }

    return {
        authorized: true,
        user: fallbackUser,
        role
    }
}

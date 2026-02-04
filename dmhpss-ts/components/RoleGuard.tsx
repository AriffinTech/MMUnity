import { createClient } from '@/utils/supabase/server'
import { Role } from '@/types'
import { ReactNode } from 'react'

export default async function RoleGuard({
    children,
    requiredRole,
}: {
    children: ReactNode
    requiredRole: Role
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
                <h3 className="font-bold">Access Denied</h3>
                <p>Please log in to view this content.</p>
            </div>
        )
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== requiredRole) {
        return (
            <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
                <h3 className="font-bold">Access Denied</h3>
                <p>You do not have the required permissions ({requiredRole}) to view this content.</p>
            </div>
        )
    }

    return <>{children}</>
}

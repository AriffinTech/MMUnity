import React from "react"
import { createClient } from "@/utils/supabase/server"
import { AppSidebar } from "@/components/AppSidebar"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"



export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Default to 'user' if role missing (shouldn't happen with trigger)
    let role: 'user' | 'counselor' | 'moderator' | 'admin' = 'user'

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile) {
        role = profile.role as 'user' | 'counselor' | 'moderator' | 'admin'
    }

    return (
        <div className="flex h-screen bg-background text-text-main flex-col md:flex-row overflow-hidden">
            <AppSidebar role={role} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
                <div className="mx-auto max-w-6xl space-y-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

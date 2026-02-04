'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface Profile {
    full_name: string | null
    email: string | null
    role: string
}

export default function SettingsPage() {
    const router = useRouter()
    const supabase = createClient()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            setProfile({
                full_name: data?.full_name || user.user_metadata?.full_name,
                email: user.email || null,
                role: data?.role || 'user'
            })
            setIsLoading(false)
        }
        fetchProfile()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    if (isLoading) return <div className="p-8">Loading settings...</div>

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-main">Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Your personal details and role.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Full Name</p>
                            <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{profile?.email}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Role</p>
                            <Badge variant="secondary" className="mt-1 uppercase text-xs">
                                {profile?.role}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>



            <div className="pt-4">
                <Button variant="destructive" className="w-full md:w-auto" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}

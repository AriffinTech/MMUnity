'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const trimmedEmail = email.trim()

        if (!trimmedEmail || !password) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' })
            setLoading(false)
            return
        }

        if (isLogin) {
            const { data: { user }, error } = await supabase.auth.signInWithPassword({
                email: trimmedEmail,
                password,
            })

            if (error || !user) {
                setMessage({ type: 'error', text: error?.message || 'Login failed' })
                setLoading(false)
            } else {
                // Fetch profile to get role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                router.refresh()

                // Redirect based on role
                const role = profile?.role
                if (role === 'admin') router.push('/admin')
                else if (role === 'moderator') router.push('/moderator')
                else if (role === 'counselor') router.push('/counselor')
                else router.push('/student')
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email: trimmedEmail,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (error) {
                setMessage({ type: 'error', text: error.message })
            } else {
                setMessage({ type: 'success', text: 'Success! Please check your email to confirm your account.' })
            }
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        MMUnity
                    </p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => { setIsLogin(true); setMessage(null); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setMessage(null); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Sign Up
                    </button>
                </div>



                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    required={!isLogin}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-primary/70' : 'bg-primary hover:bg-primary/90'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors`}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

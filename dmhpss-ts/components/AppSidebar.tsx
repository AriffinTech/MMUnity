"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    Users,
    ShieldAlert,
    BarChart3,
    Settings,
    MessageSquare,
    BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type UserRole = 'user' | 'counselor' | 'moderator' | 'admin'

interface SidebarProps {
    role: UserRole
}

const allNavItems = [
    {
        label: "Home",
        href: "/student",
        icon: Home,
        roles: ['user', 'counselor', 'moderator', 'admin'] // Everyone has a dashboard
    },
    {
        label: "Peer Support",
        href: "/peer-support",
        icon: Users,
        roles: ['user', 'counselor', 'moderator', 'admin']
    },
    {
        label: "Messages",
        href: "/messages",
        icon: MessageSquare,
        roles: ['user', 'counselor'] // Students & Counselors chat
    },
    {
        label: "Counselor Dashboard",
        href: "/counselor",
        icon: BookOpen,
        roles: ['counselor', 'admin']
    },
    {
        label: "Moderator Queue",
        href: "/moderator",
        icon: ShieldAlert,
        roles: ['moderator', 'admin']
    },
    {
        label: "Admin Console",
        href: "/admin",
        icon: BarChart3,
        roles: ['admin']
    },
]

export function AppSidebar({ role }: SidebarProps) {
    const pathname = usePathname()

    const filteredNavItems = allNavItems.filter(item => item.roles.includes(role))

    return (
        <>
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 flex-col border-r bg-secondary/10 p-6 h-full">
                <div className="flex items-center gap-2 mb-8">
                    <img src="/mmunity-logo.png" alt="MMUnity" className="h-8 w-8 object-contain" />
                    <span className="text-xl font-bold tracking-tight text-black">MMUnity</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {filteredNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <span
                                className={cn(
                                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary/30",
                                    pathname === item.href
                                        ? "bg-secondary text-secondary-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto">
                    <Link href="/settings">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:bg-secondary/30 hover:text-secondary-foreground">
                            <Settings className="h-5 w-5" />
                            Settings
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Bottom Navigation (Mobile) */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden px-4">
                {filteredNavItems.map((item) => (
                    <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
                        <div
                            className={cn(
                                "p-2 rounded-2xl transition-all",
                                pathname === item.href ? "bg-secondary/30 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </>
    )
}

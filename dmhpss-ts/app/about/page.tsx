"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { User, BookOpen, ShieldAlert, BarChart3, LogIn, Info, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
    const links = [
        {
            label: "Student Portal",
            href: "/student",
            icon: (
                <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Counselor Portal",
            href: "/counselor",
            icon: (
                <BookOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Moderator",
            href: "/moderator",
            icon: (
                <ShieldAlert className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Admin",
            href: "/admin",
            icon: (
                <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "About",
            href: "/about",
            icon: (
                <Info className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Log In",
            href: "/login",
            icon: (
                <LogIn className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            )
        }
    ];
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row-reverse bg-white w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10 bg-primary">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        {/* Optional footer content for sidebar */}
                    </div>
                </SidebarBody>
            </Sidebar>
            <AboutContent />
        </div>
    );
}

const Logo = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 flex-shrink-0">
                <img src="/mmunity-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                MMUnity
            </motion.span>
        </Link>
    );
};

const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 flex-shrink-0">
                <img src="/mmunity-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
        </Link>
    );
};

const AboutContent = () => {
    const team = [
        {
            name: "Danial",
            role: "Project Leader",
            bio: "Mental",
            avatar: "/DANIAL.jpeg",
        },
        {
            name: "Ariff",
            role: "Programming Leader",
            bio: "Health",
            avatar: "/ariff.jpg",
        },
        {
            name: "Adam",
            role: "Quality Manager",
            bio: "Matters",
            avatar: "/adam.jpeg",
        },
        {
            name: "Ayanle",
            role: "Documentation Manager",
            bio: "!",
            avatar: "/AyANLE.jpeg",
        },
    ];

    return (
        <div className="flex flex-1 flex-col p-8 bg-gray-50 overflow-y-auto w-full h-full">
            <div className="max-w-5xl mx-auto w-full space-y-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        About MMUnity
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                        A safe haven connecting students, empathetic peers, and professional care.
                    </p>
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid md:grid-cols-2 gap-8 items-center"
                >
                    <div className="space-y-6">
                        <h2 className="text-3xl font-semibold text-neutral-800">Why We Are Here</h2>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            Navigating university life comes with its unique set of challenges. At MMUnity, we believe no student should have to face them in silence.
                            We provide a secure, anonymous sanctuary where you can track your well-being, connect with understanding peers, and seamlessly reach out to professional counselors when you need that extra support.
                        </p>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            We believe in the power of community to heal, uplift, and transform lives.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                        {/* Placeholder for an about image or graphic */}
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary text-lg font-medium">Stronger Together</span>
                        </div>
                    </div>
                </motion.div>

                {/* Meet the Team Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    <h2 className="text-3xl font-semibold text-center text-neutral-800">Meet the Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, idx) => (
                            <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="flex flex-col items-center">
                                    <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-sm">
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <CardTitle className="text-lg font-bold text-neutral-800">{member.name}</CardTitle>
                                    <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center text-neutral-600 text-sm">
                                    {member.bio}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Footer / CTA */}
                <div className="text-center py-10">
                    <p className="text-neutral-500 text-sm">Made by students of Group 1 TT13L</p>
                </div>
            </div>
        </div>
    );
};

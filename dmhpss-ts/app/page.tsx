"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { User, BookOpen, ShieldAlert, BarChart3, LogIn, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextShimmer } from '@/components/TextShimmer';
import { Button } from '@/components/ui/button';

export default function Home() {
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
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
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

export const LogoIcon = () => {
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

// Main content component (replacing Dashboard)
const Dashboard = () => {
  return (
    <div className="flex flex-1 items-center justify-center p-8 bg-white overflow-y-auto w-full h-full">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-10"
        >
          <div className="flex justify-center mb-6">
            <div className="relative h-32 w-32 rounded-3xl overflow-hidden shadow-lg">
              <img
                src="/mmunity-logo.png"
                alt="MMUnity Logo"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <TextShimmer className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
            You Don't Have to Do This Alone.
          </TextShimmer>
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 mt-4">
            MMUnity: Your Campus Wellness Network.
          </h2>
          <p className="mt-4 text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            A strictly confidential space to track your mood, find understanding peers, and connect with counselors when you need it most.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                Explore Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

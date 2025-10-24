"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "./ThemeProvider"

export default function Navbar() {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            JobTracker
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Dashboard
            </Link>
            <Link href="/dashboard/analytics" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              📊 Analytics
            </Link>
            <Link href="/dashboard/calendar" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              📅 Calendar
            </Link>
            <Link href="/dashboard/jobs/new" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Add Job
            </Link>
            <Link href="/dashboard/resumes" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Resumes
            </Link>

            <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition" aria-label="Toggle theme">
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {session?.user && (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 dark:text-gray-200 text-sm">{session.user.name || session.user.email}</span>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

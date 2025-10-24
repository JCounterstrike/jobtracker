"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Job } from "@prisma/client"

export default function CalendarPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week">("month")

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs")
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty days for the starting week
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }

    return days
  }

  const getJobsForDate = (date: Date | null) => {
    if (!date) return []

    return jobs.filter((job) => {
      const appliedDate = new Date(job.appliedDate)
      const deadline = job.deadline ? new Date(job.deadline) : null

      const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
      }

      return isSameDay(appliedDate, date) || (deadline && isSameDay(deadline, date))
    })
  }

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const statusColors: Record<string, string> = {
    APPLIED: "bg-blue-500 dark:bg-blue-600",
    INTERVIEW: "bg-yellow-500 dark:bg-yellow-600",
    OFFER: "bg-green-500 dark:bg-green-600",
    REJECTED: "bg-red-500 dark:bg-red-600",
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
  }

  const isCurrentMonth = (date: Date | null) => {
    if (!date) return false
    return date.getMonth() === currentDate.getMonth()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading calendar...</div>
      </div>
    )
  }

  const days = viewMode === "month" ? getDaysInMonth(currentDate) : getWeekDays(currentDate)
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">📅 Calendar View</h1>
        <button onClick={() => router.push("/dashboard")} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold">
          ← Back to Dashboard
        </button>
      </div>

      {/* View Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => (viewMode === "month" ? navigateMonth(-1) : navigateWeek(-1))} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold transition">
              ←
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 min-w-[200px] text-center">{monthName}</h2>
            <button onClick={() => (viewMode === "month" ? navigateMonth(1) : navigateWeek(1))} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold transition">
              →
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={goToToday} className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-800 transition">
              Today
            </button>
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <button onClick={() => setViewMode("month")} className={`px-4 py-2 font-semibold transition ${viewMode === "month" ? "bg-indigo-600 dark:bg-indigo-500 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}>
                Month
              </button>
              <button onClick={() => setViewMode("week")} className={`px-4 py-2 font-semibold transition ${viewMode === "week" ? "bg-indigo-600 dark:bg-indigo-500 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}>
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Applied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 dark:bg-yellow-600 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Interview</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Offer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 dark:bg-red-600 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-indigo-500 dark:border-indigo-400 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Today</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-900">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className={`grid grid-cols-7 ${viewMode === "month" ? "auto-rows-fr" : ""}`}>
          {days.map((date, index) => {
            const dayJobs = getJobsForDate(date)
            const isTodayCell = isToday(date)
            const isCurrentMonthCell = isCurrentMonth(date)

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 ${!date || !isCurrentMonthCell ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"} ${
                  isTodayCell ? "ring-2 ring-indigo-500 dark:ring-indigo-400" : ""
                } hover:bg-gray-50 dark:hover:bg-gray-750 transition`}
              >
                {date && (
                  <>
                    <div className={`text-sm font-semibold mb-2 ${isTodayCell ? "text-indigo-600 dark:text-indigo-400" : !isCurrentMonthCell ? "text-gray-400 dark:text-gray-600" : "text-gray-700 dark:text-gray-300"}`}>{date.getDate()}</div>
                    <div className="space-y-1">
                      {dayJobs.slice(0, 3).map((job) => (
                        <button
                          key={job.id}
                          onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                          className={`w-full text-left text-xs p-1 rounded ${statusColors[job.status as keyof typeof statusColors] || statusColors.APPLIED} text-white hover:opacity-80 transition truncate`}
                          title={`${job.position} at ${job.company}`}
                        >
                          {job.position}
                        </button>
                      ))}
                      {dayJobs.length > 3 && <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold pl-1">+{dayJobs.length - 3} more</div>}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Timeline View (List) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">📋 Timeline</h3>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">No job applications to display</div>
        ) : (
          <div className="space-y-4">
            {jobs
              .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
              .map((job) => (
                <div key={job.id} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition cursor-pointer" onClick={() => router.push(`/dashboard/jobs/${job.id}`)}>
                  <div className={`w-2 h-2 mt-2 rounded-full ${statusColors[job.status as keyof typeof statusColors] || statusColors.APPLIED}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {job.position} at {job.company}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(job.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{job.status}</span>
                      {job.deadline && <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
                      {job.matchScore && <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Match: {job.matchScore}%</span>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

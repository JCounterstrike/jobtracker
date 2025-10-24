"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Job {
  id: string
  company: string
  position: string
  status: string
  appliedDate: string
  deadline: string | null
  createdAt: string
  updatedAt: string
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

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

  // Calculate metrics
  const totalJobs = jobs.length
  const appliedCount = jobs.filter((j) => j.status === "APPLIED").length
  const interviewCount = jobs.filter((j) => j.status === "INTERVIEW").length
  const offerCount = jobs.filter((j) => j.status === "OFFER").length
  const rejectedCount = jobs.filter((j) => j.status === "REJECTED").length

  const successRate = totalJobs > 0 ? ((interviewCount + offerCount) / totalJobs) * 100 : 0
  const offerRate = totalJobs > 0 ? (offerCount / totalJobs) * 100 : 0

  // Status breakdown for pie chart
  const statusData = [
    { name: "Applied", value: appliedCount, color: "#3b82f6" },
    { name: "Interview", value: interviewCount, color: "#f59e0b" },
    { name: "Offer", value: offerCount, color: "#10b981" },
    { name: "Rejected", value: rejectedCount, color: "#ef4444" },
  ].filter((item) => item.value > 0)

  // Applications over time (by month)
  const applicationsByMonth = jobs.reduce((acc: any, job) => {
    const date = new Date(job.appliedDate)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
    acc[monthYear] = (acc[monthYear] || 0) + 1
    return acc
  }, {})

  const timelineData = Object.entries(applicationsByMonth)
    .map(([month, count]) => ({
      month,
      applications: count,
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split("/").map(Number)
      const [bMonth, bYear] = b.month.split("/").map(Number)
      return aYear - bYear || aMonth - bMonth
    })

  // Top companies
  const companyCounts = jobs.reduce((acc: any, job) => {
    acc[job.company] = (acc[job.company] || 0) + 1
    return acc
  }, {})

  const topCompanies = Object.entries(companyCounts)
    .map(([company, count]) => ({ company, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5)

  // Average days to response (for rejected/interview/offer)
  const responseTimes = jobs
    .filter((j) => j.status !== "APPLIED")
    .map((job) => {
      const applied = new Date(job.appliedDate).getTime()
      const updated = new Date(job.updatedAt).getTime()
      return Math.floor((updated - applied) / (1000 * 60 * 60 * 24))
    })

  const avgResponseTime = responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    )
  }

  if (totalJobs === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Yet</h2>
        <p className="text-gray-600 mb-6">Start tracking job applications to see analytics!</p>
        <button onClick={() => router.push("/dashboard/jobs/new")} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
          Add Your First Job
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">📊 Analytics & Insights</h1>
        <button onClick={() => router.push("/dashboard")} className="text-indigo-600 hover:text-indigo-700 font-semibold">
          ← Back to Dashboard
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Applications</div>
          <div className="text-3xl font-bold text-gray-900">{totalJobs}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Success Rate</div>
          <div className="text-3xl font-bold text-green-600">{successRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">Interview + Offer / Total</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Offer Rate</div>
          <div className="text-3xl font-bold text-indigo-600">{offerRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">Offers / Total</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Avg Response Time</div>
          <div className="text-3xl font-bold text-gray-900">{avgResponseTime}</div>
          <div className="text-xs text-gray-500 mt-1">days</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Over Time</h3>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2} name="Applications" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-20">Not enough data yet</div>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Companies Applied</h3>
          {topCompanies.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCompanies}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-20">Not enough data yet</div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {jobs
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 10)
              .map((job) => (
                <div key={job.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition" onClick={() => router.push(`/dashboard/jobs/${job.id}`)}>
                  <div className={`w-2 h-2 mt-2 rounded-full ${job.status === "OFFER" ? "bg-green-500" : job.status === "INTERVIEW" ? "bg-yellow-500" : job.status === "REJECTED" ? "bg-red-500" : "bg-blue-500"}`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {job.position} at {job.company}
                    </div>
                    <div className="text-sm text-gray-600">
                      Status: {job.status} • {new Date(job.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-md p-6 border-2 border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights & Recommendations</h3>
        <div className="space-y-2 text-gray-700">
          {successRate < 20 && totalJobs > 5 && <p>• Your success rate is {successRate.toFixed(1)}%. Consider tailoring your applications more closely to job requirements.</p>}
          {successRate > 50 && totalJobs > 5 && <p>• Great job! Your {successRate.toFixed(1)}% success rate is above average. Keep up the good work!</p>}
          {avgResponseTime > 14 && <p>• Average response time is {avgResponseTime} days. Consider following up after 7-10 days.</p>}
          {interviewCount > 0 && offerCount === 0 && <p>• You have {interviewCount} interview(s) but no offers yet. Focus on interview preparation!</p>}
          {appliedCount > totalJobs * 0.7 && totalJobs > 10 && <p>• {appliedCount} applications are still pending. Follow up with companies to show interest!</p>}
          {totalJobs < 10 && <p>• Keep applying! Most successful job seekers send 50-100 applications.</p>}
        </div>
      </div>
    </div>
  )
}

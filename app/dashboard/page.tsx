"use client"

import { useEffect, useState } from "react"
import { Job } from "@prisma/client"
import JobCard from "@/components/JobCard"
import Link from "next/link"
import { exportToCSV, exportToJSON } from "@/lib/export"

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [statusFilter])

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showExportMenu && !target.closest(".export-menu-container")) {
        setShowExportMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showExportMenu])

  const fetchJobs = async () => {
    try {
      const url = statusFilter === "ALL" ? "/api/jobs" : `/api/jobs?status=${statusFilter}`

      const response = await fetch(url)
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job application?")) {
      return
    }

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setJobs(jobs.filter((job) => job.id !== id))
        // Remove from selection if it was selected
        const newSelection = new Set(selectedJobIds)
        newSelection.delete(id)
        setSelectedJobIds(newSelection)
      }
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  // Bulk selection handlers
  const toggleJobSelection = (jobId: string) => {
    const newSelection = new Set(selectedJobIds)
    if (newSelection.has(jobId)) {
      newSelection.delete(jobId)
    } else {
      newSelection.add(jobId)
    }
    setSelectedJobIds(newSelection)
  }

  const toggleSelectAll = () => {
    if (selectedJobIds.size === sortedJobs.length) {
      setSelectedJobIds(new Set())
    } else {
      setSelectedJobIds(new Set(sortedJobs.map((job) => job.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedJobIds.size === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedJobIds.size} job application(s)?`)) {
      return
    }

    try {
      await Promise.all(Array.from(selectedJobIds).map((id) => fetch(`/api/jobs/${id}`, { method: "DELETE" })))
      setJobs(jobs.filter((job) => !selectedJobIds.has(job.id)))
      setSelectedJobIds(new Set())
      setShowBulkActions(false)
    } catch (error) {
      console.error("Error bulk deleting jobs:", error)
      alert("Failed to delete some jobs. Please try again.")
    }
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedJobIds.size === 0) return

    try {
      await Promise.all(
        Array.from(selectedJobIds).map((id) =>
          fetch(`/api/jobs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: newStatus,
            }),
          })
        )
      )
      // Refresh jobs
      await fetchJobs()
      setSelectedJobIds(new Set())
      setShowBulkActions(false)
    } catch (error) {
      console.error("Error bulk updating status:", error)
      alert("Failed to update some jobs. Please try again.")
    }
  }

  const selectedJobs = jobs.filter((job) => selectedJobIds.has(job.id))

  // Filter jobs by search query
  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchQuery.toLowerCase()
    return job.company.toLowerCase().includes(searchLower) || job.position.toLowerCase().includes(searchLower) || job.description?.toLowerCase().includes(searchLower)
  })

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "company":
        return a.company.localeCompare(b.company)
      case "deadline":
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      default:
        return 0
    }
  })

  // Calculate overdue jobs
  const overdueJobs = jobs.filter((job) => {
    if (!job.deadline || job.status === "OFFER" || job.status === "REJECTED") return false
    return new Date(job.deadline) < new Date()
  }).length

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "APPLIED").length,
    interview: jobs.filter((j) => j.status === "INTERVIEW").length,
    offer: jobs.filter((j) => j.status === "OFFER").length,
    rejected: jobs.filter((j) => j.status === "REJECTED").length,
    overdue: overdueJobs,
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Job Applications</h1>
        <div className="flex gap-3 flex-wrap">
          {selectedJobIds.size > 0 && (
            <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900 px-4 py-2 rounded-lg">
              <span className="font-semibold text-indigo-800 dark:text-indigo-200">{selectedJobIds.size} selected</span>
              <button onClick={() => setSelectedJobIds(new Set())} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold text-sm">
                Clear
              </button>
            </div>
          )}

          {selectedJobIds.size > 0 && (
            <div className="relative export-menu-container">
              <button onClick={() => setShowBulkActions(!showBulkActions)} className="bg-purple-600 dark:bg-purple-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition flex items-center gap-2">
                ⚡ Bulk Actions
                <span className="text-xs">▼</span>
              </button>
              {showBulkActions && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 z-20">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">{selectedJobIds.size} job(s) selected</p>
                  </div>
                  <button
                    onClick={() => {
                      exportToCSV(selectedJobs)
                      setShowBulkActions(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition text-gray-700 dark:text-gray-300 font-medium"
                  >
                    📥 Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      exportToJSON(selectedJobs)
                      setShowBulkActions(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition text-gray-700 dark:text-gray-300 font-medium border-t border-gray-100 dark:border-gray-700"
                  >
                    📄 Export as JSON
                  </button>
                  <div className="border-t-2 border-gray-200 dark:border-gray-700 my-1"></div>
                  <button onClick={() => handleBulkStatusUpdate("INTERVIEW")} className="w-full text-left px-4 py-3 hover:bg-yellow-50 dark:hover:bg-yellow-950 transition text-gray-700 dark:text-gray-300 font-medium">
                    📞 Mark as Interview
                  </button>
                  <button onClick={() => handleBulkStatusUpdate("OFFER")} className="w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-green-950 transition text-gray-700 dark:text-gray-300 font-medium">
                    🎉 Mark as Offer
                  </button>
                  <button onClick={() => handleBulkStatusUpdate("REJECTED")} className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950 transition text-gray-700 dark:text-gray-300 font-medium">
                    ❌ Mark as Rejected
                  </button>
                  <div className="border-t-2 border-gray-200 dark:border-gray-700 my-1"></div>
                  <button onClick={handleBulkDelete} className="w-full text-left px-4 py-3 hover:bg-red-100 dark:hover:bg-red-950 transition text-red-600 dark:text-red-400 font-semibold">
                    🗑️ Delete Selected
                  </button>
                  <button onClick={() => setShowBulkActions(false)} className="w-full text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          <Link href="/dashboard/jobs/new" className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
            + Add New Job
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.applied}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Applied</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.interview}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Interview</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.offer}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Offer</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
        </div>
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center ${stats.overdue > 0 ? "border-2 border-red-300 dark:border-red-600" : ""}`}>
          <div className={`text-2xl font-bold ${stats.overdue > 0 ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500"}`}>{stats.overdue}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔍 Search Jobs
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by company, position, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="md:w-48">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📊 Sort By
            </label>
            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company A-Z</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>
        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Found {filteredJobs.length} result(s) for "{searchQuery}"
            <button onClick={() => setSearchQuery("")} className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline">
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Filters and Select All */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-2">
          {["ALL", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${statusFilter === status ? "bg-indigo-600 dark:bg-indigo-500 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              {status}
            </button>
          ))}
        </div>

        {sortedJobs.length > 0 && (
          <label className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <input type="checkbox" checked={selectedJobIds.size === sortedJobs.length && sortedJobs.length > 0} onChange={toggleSelectAll} className="w-4 h-4 text-indigo-600 dark:text-indigo-400 rounded focus:ring-indigo-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Select All ({sortedJobs.length})</span>
          </label>
        )}
      </div>

      {/* Job List */}
      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No job applications yet</p>
          <Link href="/dashboard/jobs/new" className="inline-block bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
            Add Your First Job
          </Link>
        </div>
      ) : sortedJobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No jobs found matching "{searchQuery}"</p>
          <button onClick={() => setSearchQuery("")} className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedJobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={handleDelete} isSelected={selectedJobIds.has(job.id)} onToggleSelect={() => toggleJobSelection(job.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

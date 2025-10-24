"use client"

import Link from "next/link"
import { Job } from "@prisma/client"

interface JobCardProps {
  job: Job
  onDelete?: (id: string) => void
  isSelected?: boolean
  onToggleSelect?: () => void
}

const statusColors = {
  APPLIED: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  INTERVIEW: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
  OFFER: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  REJECTED: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
}

export default function JobCard({ job, onDelete, isSelected, onToggleSelect }: JobCardProps) {
  const statusClass = statusColors[job.status as keyof typeof statusColors] || statusColors.APPLIED

  // Check if deadline is approaching or overdue
  const isOverdue = job.deadline && new Date(job.deadline) < new Date() && job.status !== "OFFER" && job.status !== "REJECTED"

  const isApproaching =
    job.deadline &&
    !isOverdue &&
    new Date(job.deadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 && // 7 days
    job.status !== "OFFER" &&
    job.status !== "REJECTED"

  const daysUntilDeadline = job.deadline ? Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition relative ${isOverdue ? "border-2 border-red-500 dark:border-red-400" : ""} ${isApproaching ? "border-2 border-yellow-400 dark:border-yellow-500" : ""} ${
        isSelected ? "ring-2 ring-indigo-500 dark:ring-indigo-400 bg-indigo-50 dark:bg-indigo-950" : ""
      }`}
    >
      {onToggleSelect && (
        <div className="absolute top-4 left-4">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={(e) => {
              e.stopPropagation()
              onToggleSelect()
            }}
            className="w-5 h-5 text-indigo-600 dark:text-indigo-400 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer"
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-4 ml-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{job.position}</h3>
          <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>{job.status}</span>
      </div>

      {job.matchScore !== null && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Match Score:</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{job.matchScore}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full" style={{ width: `${job.matchScore}%` }}></div>
          </div>
        </div>
      )}

      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{job.description}</p>

      <div className="space-y-2 text-sm mb-4">
        <div className="text-gray-500 dark:text-gray-400">Applied: {new Date(job.appliedDate).toLocaleDateString()}</div>
        {job.deadline && (
          <div className={`font-semibold ${isOverdue ? "text-red-600 dark:text-red-400" : isApproaching ? "text-yellow-600 dark:text-yellow-400" : "text-gray-500 dark:text-gray-400"}`}>
            {isOverdue ? (
              <span className="flex items-center gap-1">⚠️ Overdue by {Math.abs(daysUntilDeadline!)} day(s)</span>
            ) : isApproaching ? (
              <span className="flex items-center gap-1">⏰ Deadline in {daysUntilDeadline} day(s)</span>
            ) : (
              <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Link href={`/dashboard/jobs/${job.id}`} className="flex-1 text-center bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
          View Details
        </Link>
        {onDelete && (
          <button onClick={() => onDelete(job.id)} className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

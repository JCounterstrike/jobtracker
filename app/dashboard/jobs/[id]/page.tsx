"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Job } from "@prisma/client"

interface Resume {
  id: string
  fileName: string
  createdAt: string
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string>("")
  const [matchLoading, setMatchLoading] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    description: "",
    status: "APPLIED",
    deadline: "",
    notes: "",
  })

  useEffect(() => {
    fetchJob()
    fetchResumes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}`)
      if (response.ok) {
        const data = await response.json()
        setJob(data)
        setFormData({
          company: data.company,
          position: data.position,
          description: data.description,
          status: data.status,
          deadline: data.deadline ? new Date(data.deadline).toISOString().split("T")[0] : "",
          notes: data.notes || "",
        })
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error fetching job:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes")
      if (response.ok) {
        const data = await response.json()
        setResumes(data)
      }
    } catch (error) {
      console.error("Error fetching resumes:", error)
    }
  }

  const handleCalculateMatch = async () => {
    if (!selectedResumeId) {
      alert("Please select a resume first")
      return
    }

    setMatchLoading(true)
    try {
      const response = await fetch(`/api/jobs/${id}/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeId: selectedResumeId }),
      })

      if (response.ok) {
        const data = await response.json()
        // Refresh job to show updated match score
        await fetchJob()
        alert(data.message)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to calculate match score")
      }
    } catch (error) {
      console.error("Error calculating match:", error)
      alert("An error occurred while calculating match score")
    } finally {
      setMatchLoading(false)
    }
  }

  const handleGenerateSuggestions = async () => {
    if (!selectedResumeId) {
      alert("Please select a resume first")
      return
    }

    setSuggestionsLoading(true)
    try {
      const response = await fetch(`/api/jobs/${id}/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeId: selectedResumeId }),
      })

      if (response.ok) {
        // Refresh job to show suggestions
        await fetchJob()
        alert("Suggestions generated successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to generate suggestions")
      }
    } catch (error) {
      console.error("Error generating suggestions:", error)
      alert("An error occurred while generating suggestions")
    } finally {
      setSuggestionsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedJob = await response.json()
        setJob(updatedJob)
        setEditing(false)
      } else {
        alert("Failed to update job application")
      }
    } catch (error) {
      console.error("Error updating job:", error)
      alert("An error occurred")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job application?")) {
      return
    }

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  const statusColors = {
    APPLIED: "bg-blue-100 text-blue-800",
    INTERVIEW: "bg-yellow-100 text-yellow-800",
    OFFER: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!job) {
    return <div className="text-center py-12">Job not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => router.back()} className="text-indigo-600 hover:text-indigo-700 font-semibold">
          ← Back to Dashboard
        </button>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                Edit
              </button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                Delete
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
              Cancel
            </button>
          )}
        </div>
      </div>

      {!editing ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.position}</h1>
              <p className="text-xl text-gray-600">{job.company}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[job.status as keyof typeof statusColors]}`}>{job.status}</span>
          </div>

          {/* AI Matching Section */}
          <div className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🤖 AI Resume Matching</h3>

            <div className="mb-4">
              <label htmlFor="resume-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select a resume to analyze:
              </label>
              <div className="flex gap-3">
                <select id="resume-select" value={selectedResumeId} onChange={(e) => setSelectedResumeId(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">-- Select Resume --</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.fileName} ({new Date(resume.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                <button onClick={handleCalculateMatch} disabled={!selectedResumeId || matchLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {matchLoading ? "Calculating..." : "Calculate Match"}
                </button>
              </div>
            </div>

            {resumes.length === 0 && (
              <p className="text-sm text-gray-600 mb-3">
                No resumes uploaded yet.{" "}
                <a href="/dashboard/resumes" className="text-indigo-600 hover:underline font-semibold">
                  Upload a resume
                </a>{" "}
                to get started!
              </p>
            )}

            {job.matchScore !== null && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Match Score:</span>
                  <span className="text-3xl font-bold text-indigo-600">{job.matchScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div className={`h-4 rounded-full transition-all ${job.matchScore >= 80 ? "bg-green-500" : job.matchScore >= 60 ? "bg-yellow-500" : "bg-orange-500"}`} style={{ width: `${job.matchScore}%` }}></div>
                </div>
                <p className="text-sm text-gray-600">{job.matchScore >= 80 ? "🎉 Excellent match! Your resume aligns well with this job." : job.matchScore >= 60 ? "👍 Good match, but there's room for improvement." : "💡 Consider tailoring your resume for this position."}</p>

                <button onClick={handleGenerateSuggestions} disabled={!selectedResumeId || suggestionsLoading} className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {suggestionsLoading ? "Generating Suggestions..." : "✨ Get AI Tailoring Suggestions"}
                </button>
              </div>
            )}

            {job.suggestions && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>💡</span> AI Suggestions for Improving Your Resume:
                </h4>
                <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{job.suggestions}</div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Applied Date</h3>
                <p className="text-gray-700">{new Date(job.appliedDate).toLocaleDateString()}</p>
              </div>
              {job.deadline && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Deadline</h3>
                  <p className="text-gray-700">{new Date(job.deadline).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {job.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.notes}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input id="position" name="position" type="text" value={formData.position} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
          </div>

          <div className="mt-8">
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

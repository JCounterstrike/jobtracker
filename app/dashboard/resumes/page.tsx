"use client"

import { useEffect, useState } from "react"
import { Resume } from "@prisma/client"
import ResumeUpload from "@/components/ResumeUpload"

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes")
      if (response.ok) {
        const data = await response.json()
        setResumes(data)
      }
    } catch (error) {
      console.error("Error fetching resumes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) {
      return
    }

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setResumes(resumes.filter((resume) => resume.id !== id))
      }
    } catch (error) {
      console.error("Error deleting resume:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Resumes</h1>

      {/* Upload Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upload New Resume
        </h2>
        <ResumeUpload onUploadSuccess={fetchResumes} />
      </div>

      {/* Resume List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Saved Resumes ({resumes.length})
        </h2>

        {resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-600 text-lg mb-4">
              No resumes uploaded yet
            </p>
            <p className="text-gray-500 text-sm">
              Upload your first resume above to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">📄</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {resume.fileName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Uploaded{" "}
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {resume.parsedText && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {resume.parsedText.substring(0, 200)}...
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
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

"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

interface ResumeUploadProps {
  onUploadSuccess: () => void
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setError("")

      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/resumes/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Upload failed")
        }

        onUploadSuccess()
      } catch (err: any) {
        setError(err.message || "An error occurred during upload")
      } finally {
        setUploading(false)
      }
    },
    [onUploadSuccess]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <div>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"} ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
        <input {...getInputProps()} />
        <div className="text-6xl mb-4">📄</div>
        {uploading ? (
          <p className="text-lg text-gray-600">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-lg text-indigo-600 font-semibold">Drop your resume here</p>
        ) : (
          <>
            <p className="text-lg text-gray-700 font-semibold mb-2">Drag & drop your resume here</p>
            <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            <p className="text-xs text-gray-400">Supports PDF and DOCX files</p>
          </>
        )}
      </div>

      {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
    </div>
  )
}

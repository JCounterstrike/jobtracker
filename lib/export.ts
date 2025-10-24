import { Job } from "@prisma/client"

/**
 * Export jobs to CSV format
 */
export function exportToCSV(jobs: Job[]): void {
  if (jobs.length === 0) {
    alert("No jobs to export")
    return
  }

  const headers = ["Company", "Position", "Status", "Applied Date", "Deadline", "Match Score", "Notes", "Description"]

  const csvData = jobs.map((job) => [job.company, job.position, job.status, new Date(job.appliedDate).toLocaleDateString(), job.deadline ? new Date(job.deadline).toLocaleDateString() : "", job.matchScore || "", job.notes || "", job.description?.replace(/"/g, '""') || ""])

  const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  downloadFile(csvContent, "jobtracker-jobs.csv", "text/csv")
}

/**
 * Export jobs to JSON format
 */
export function exportToJSON(jobs: Job[]): void {
  if (jobs.length === 0) {
    alert("No jobs to export")
    return
  }

  const jsonData = {
    exportedAt: new Date().toISOString(),
    totalJobs: jobs.length,
    jobs: jobs.map((job) => ({
      company: job.company,
      position: job.position,
      description: job.description,
      status: job.status,
      appliedDate: job.appliedDate,
      deadline: job.deadline,
      notes: job.notes,
      matchScore: job.matchScore,
      suggestions: job.suggestions,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    })),
  }

  const jsonContent = JSON.stringify(jsonData, null, 2)
  downloadFile(jsonContent, "jobtracker-jobs.json", "application/json")
}

/**
 * Helper function to download a file
 */
function downloadFile(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export summary statistics
 */
export function exportSummary(jobs: Job[]): string {
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "APPLIED").length,
    interview: jobs.filter((j) => j.status === "INTERVIEW").length,
    offer: jobs.filter((j) => j.status === "OFFER").length,
    rejected: jobs.filter((j) => j.status === "REJECTED").length,
  }

  const successRate = stats.total > 0 ? (((stats.interview + stats.offer) / stats.total) * 100).toFixed(1) : "0.0"

  return `
JobTracker Export Summary
Generated: ${new Date().toLocaleString()}

Total Applications: ${stats.total}
Applied: ${stats.applied}
Interview: ${stats.interview}
Offers: ${stats.offer}
Rejected: ${stats.rejected}
Success Rate: ${successRate}%

Top Companies:
${getTopCompanies(jobs)}
  `.trim()
}

function getTopCompanies(jobs: Job[]): string {
  const companyCounts: Record<string, number> = {}
  jobs.forEach((job) => {
    companyCounts[job.company] = (companyCounts[job.company] || 0) + 1
  })

  return Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([company, count], index) => `${index + 1}. ${company} (${count})`)
    .join("\n")
}

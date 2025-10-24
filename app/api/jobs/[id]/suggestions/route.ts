import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateTailoringSuggestions } from "@/lib/openai"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { resumeId } = body

    if (!resumeId) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 })
    }

    // Fetch job and verify ownership
    const job = await prisma.job.findUnique({
      where: { id },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch resume and verify ownership
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    if (resume.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!resume.parsedText || !job.description) {
      return NextResponse.json({ error: "Resume or job description text not available" }, { status: 400 })
    }

    // Generate suggestions using GPT
    try {
      const matchScore = job.matchScore || 0
      const suggestions = await generateTailoringSuggestions(resume.parsedText, `${job.position} at ${job.company}\n\n${job.description}`, matchScore)

      // Store suggestions in the job record
      await prisma.job.update({
        where: { id },
        data: { suggestions },
      })

      return NextResponse.json({
        suggestions,
        matchScore,
      })
    } catch (error) {
      console.error("Error generating suggestions:", error)
      return NextResponse.json({ error: "Failed to generate suggestions. Please try again." }, { status: 500 })
    }
  } catch (error) {
    console.error("Suggestions API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

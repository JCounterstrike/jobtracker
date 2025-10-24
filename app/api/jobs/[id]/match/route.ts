import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateEmbedding, cosineSimilarity, similarityToPercentage } from "@/lib/openai"

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

    // Generate job embedding if not already present
    let jobEmbedding: number[] | null = null
    const jobEmbeddingResult = await prisma.$queryRaw<Array<{ embedding: string }>>`
      SELECT embedding::text FROM "Job" WHERE id = ${id}
    `

    if (jobEmbeddingResult[0]?.embedding) {
      // Parse the PostgreSQL vector format: [0.1,0.2,0.3,...]
      jobEmbedding = JSON.parse(jobEmbeddingResult[0].embedding)
    }

    if (!jobEmbedding && job.description) {
      try {
        // Generate embedding for job description
        const jobText = `${job.position} at ${job.company}\n\n${job.description}`
        jobEmbedding = await generateEmbedding(jobText)

        // Store the embedding
        await prisma.$executeRaw`
          UPDATE "Job" 
          SET embedding = ${jobEmbedding}::vector 
          WHERE id = ${id}
        `
      } catch (error) {
        console.error("Error generating job embedding:", error)
        return NextResponse.json({ error: "Failed to generate job embedding" }, { status: 500 })
      }
    }

    // Get resume embedding
    let resumeEmbedding: number[] | null = null
    const resumeEmbeddingResult = await prisma.$queryRaw<Array<{ embedding: string }>>`
      SELECT embedding::text FROM "Resume" WHERE id = ${resumeId}
    `

    if (resumeEmbeddingResult[0]?.embedding) {
      resumeEmbedding = JSON.parse(resumeEmbeddingResult[0].embedding)
    }

    if (!resumeEmbedding) {
      // Try to generate embedding from parsed text if available
      if (resume.parsedText) {
        try {
          resumeEmbedding = await generateEmbedding(resume.parsedText)
          // Store the embedding
          await prisma.$executeRaw`
            UPDATE "Resume" 
            SET embedding = ${resumeEmbedding}::vector 
            WHERE id = ${resumeId}
          `
        } catch (error) {
          console.error("Error generating resume embedding:", error)
        }
      }

      if (!resumeEmbedding) {
        return NextResponse.json(
          {
            error: "Resume embedding not available. Please re-upload the resume.",
          },
          { status: 400 }
        )
      }
    }

    // Calculate similarity
    const similarity = cosineSimilarity(jobEmbedding, resumeEmbedding)
    const matchScore = similarityToPercentage(similarity)

    // Update job with match score
    await prisma.job.update({
      where: { id },
      data: { matchScore },
    })

    return NextResponse.json({
      matchScore,
      similarity,
      message: matchScore >= 80 ? "Excellent match!" : matchScore >= 60 ? "Good match with room for improvement" : "Consider tailoring your resume for this position",
    })
  } catch (error) {
    console.error("Match calculation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { supabaseServer } from "@/lib/supabase-server"
import { generateEmbedding } from "@/lib/openai"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF and DOCX files are allowed" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${session.user.id}/${timestamp}-${file.name}`

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabaseServer.storage.from("resumes").upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseServer.storage.from("resumes").getPublicUrl(filename)

    // Parse text from file
    let parsedText = ""
    try {
      if (file.type === "application/pdf") {
        // Dynamic import to avoid Next.js bundling issues
        const pdf = (await import("pdf-parse")).default
        const pdfData = await pdf(buffer)
        parsedText = pdfData.text
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // Dynamic import for mammoth
        const mammoth = await import("mammoth")
        const result = await mammoth.extractRawText({ buffer })
        parsedText = result.value
      }
    } catch (parseError) {
      console.error("Parse error:", parseError)
      // Continue even if parsing fails
      parsedText = "Failed to extract text from document"
    }

    // Generate embedding from parsed text
    let embedding: number[] | null = null
    if (parsedText && parsedText !== "Failed to extract text from document") {
      try {
        embedding = await generateEmbedding(parsedText)
        console.log("Generated embedding with", embedding.length, "dimensions")
      } catch (embeddingError) {
        console.error("Embedding generation error:", embeddingError)
        // Continue without embedding - can be generated later
      }
    }

    // Save to database (with embedding if generated)
    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: publicUrl,
        parsedText,
        // Prisma doesn't natively support vector type, so we'll use raw query
        // For now, create without embedding and update separately
      },
    })

    // Update with embedding using raw SQL if we have one
    if (embedding) {
      try {
        await prisma.$executeRaw`
          UPDATE "Resume" 
          SET embedding = ${embedding}::vector 
          WHERE id = ${resume.id}
        `
      } catch (vectorError) {
        console.error("Vector update error:", vectorError)
        // Resume is still saved, just without embedding
      }
    }

    return NextResponse.json(resume)
  } catch (error) {
    console.error("Resume upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

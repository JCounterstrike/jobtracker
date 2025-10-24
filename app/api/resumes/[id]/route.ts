import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { supabaseServer } from "@/lib/supabase-server"

// DELETE a resume
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify resume belongs to user
    const resume = await prisma.resume.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Extract filename from URL
    const urlParts = resume.fileUrl.split("/")
    const filename = urlParts.slice(-2).join("/") // userid/filename

    // Delete from Supabase Storage
    const { error: deleteError } = await supabaseServer.storage.from("resumes").remove([filename])

    if (deleteError) {
      console.error("Error deleting file from storage:", deleteError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    await prisma.resume.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Resume deleted successfully" })
  } catch (error) {
    console.error("Error deleting resume:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

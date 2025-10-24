import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET a single job
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = await prisma.job.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT update a job
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { company, position, description, status, deadline, notes } = data

    // Verify job belongs to user
    const existingJob = await prisma.job.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        company,
        position,
        description,
        status,
        deadline: deadline ? new Date(deadline) : null,
        notes,
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE a job
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify job belongs to user
    const existingJob = await prisma.job.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    await prisma.job.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

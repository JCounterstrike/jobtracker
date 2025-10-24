import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all jobs for the authenticated user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = {
      userId: session.user.id,
    }

    if (status) {
      where.status = status
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST create a new job
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { company, position, description, status, deadline, notes } = data

    if (!company || !position || !description) {
      return NextResponse.json(
        { error: "Company, position, and description are required" },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: {
        userId: session.user.id,
        company,
        position,
        description,
        status: status || "APPLIED",
        deadline: deadline ? new Date(deadline) : null,
        notes: notes || null,
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

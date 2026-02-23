import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/weight - Get user's weight history
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const weightEntries = await prisma.weightEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ weightEntries });
  } catch (error) {
    console.error("Error fetching weight history:", error);
    return NextResponse.json(
      { error: "Failed to fetch weight history" },
      { status: 500 }
    );
  }
}

// POST /api/user/weight - Add a weight entry
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { weight, date } = body;

    const weightEntry = await prisma.weightEntry.create({
      data: {
        userId: session.user.id,
        weight,
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json({ weightEntry });
  } catch (error) {
    console.error("Error adding weight entry:", error);
    return NextResponse.json(
      { error: "Failed to add weight entry" },
      { status: 500 }
    );
  }
}

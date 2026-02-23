import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/biometrics - Get current user's biometrics
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const biometrics = await prisma.biometrics.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ biometrics });
  } catch (error) {
    console.error("Error fetching biometrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch biometrics" },
      { status: 500 }
    );
  }
}

// POST /api/user/biometrics - Save/update user's biometrics
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
    const {
      gender,
      age,
      weight,
      height,
      activityLevel,
      isDiabetic,
      allergies,
      preferences,
    } = body;

    // Upsert biometrics
    const biometrics = await prisma.biometrics.upsert({
      where: { userId: session.user.id },
      update: {
        gender,
        age,
        weight,
        height,
        activityLevel,
        isDiabetic,
        allergies: JSON.stringify(allergies),
        preferences: JSON.stringify(preferences),
      },
      create: {
        userId: session.user.id,
        gender,
        age,
        weight,
        height,
        activityLevel,
        isDiabetic,
        allergies: JSON.stringify(allergies),
        preferences: JSON.stringify(preferences),
      },
    });

    return NextResponse.json({ biometrics });
  } catch (error) {
    console.error("Error saving biometrics:", error);
    return NextResponse.json(
      { error: "Failed to save biometrics" },
      { status: 500 }
    );
  }
}

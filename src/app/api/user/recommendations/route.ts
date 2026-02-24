import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/recommendations - Get user's recommended recipes
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const recommendations = await prisma.recommendation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

// POST /api/user/recommendations - Add recommended recipes (bulk)
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
    const { recipes } = body;

    if (!Array.isArray(recipes)) {
      return NextResponse.json(
        { error: "Recipes must be an array" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Delete existing recommendations for this user
    await prisma.recommendation.deleteMany({
      where: { userId },
    });

    // Create new recommendations using createMany
    await prisma.recommendation.createMany({
      data: recipes.map((recipe: {
        recipeId: string;
        name: string;
        kalori: number;
        protein: number;
        karbohidrat: number;
        lemak: number;
        serat: number;
        link: string;
      }) => ({
        userId,
        recipeId: recipe.recipeId,
        name: recipe.name,
        kalori: recipe.kalori,
        protein: recipe.protein,
        karbohidrat: recipe.karbohidrat,
        lemak: recipe.lemak,
        serat: recipe.serat,
        link: recipe.link,
      })),
    });

    return NextResponse.json({ success: true, count: recipes.length });
  } catch (error) {
    console.error("Error adding recommendations:", error);
    return NextResponse.json(
      { error: "Failed to add recommendations" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/recommendations - Clear all recommendations for a user
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.recommendation.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing recommendations:", error);
    return NextResponse.json(
      { error: "Failed to remove recommendations" },
      { status: 500 }
    );
  }
}

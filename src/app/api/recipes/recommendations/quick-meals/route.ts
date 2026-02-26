/**
 * Quick Meals Recommendations (Easy & Fast)
 * GET /api/recipes/recommendations/quick-meals
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') 
      ? parseInt(request.nextUrl.searchParams.get('limit')!) 
      : 10;

    // Get quick meals (cooking time < 30 min and easy/medium difficulty)
    const recipes = await prisma.recipe.findMany({
      where: {
        cookingTime: { not: null, lte: 30 },
        OR: [
          { prepDifficulty: 'Easy' },
          { prepDifficulty: 'Medium' },
        ],
      },
      orderBy: { cookingTime: 'asc' },
      take: limit,
      select: {
        id: true,
        title: true,
        url: true,
        cookingTime: true,
        portion: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        imageUrl: true,
        dietType: true,
        prepDifficulty: true,
        estimatedCostLevel: true,
        suitableFor: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error('Error fetching quick meals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

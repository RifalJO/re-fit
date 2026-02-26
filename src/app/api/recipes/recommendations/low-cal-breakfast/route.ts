/**
 * Low Calorie Breakfast Recommendations
 * GET /api/recipes/recommendations/low-cal-breakfast
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') 
      ? parseInt(request.nextUrl.searchParams.get('limit')!) 
      : 10;

    // Get low-calorie breakfast recipes
    const recipes = await prisma.recipe.findMany({
      where: {
        suitableFor: 'Breakfast',
        calories: { not: null, lte: 400 },
      },
      orderBy: { calories: 'asc' },
      take: limit,
      select: {
        id: true,
        title: true,
        url: true,
        cookingTime: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        imageUrl: true,
        dietType: true,
        prepDifficulty: true,
        suitableFor: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error('Error fetching low-cal breakfast recipes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

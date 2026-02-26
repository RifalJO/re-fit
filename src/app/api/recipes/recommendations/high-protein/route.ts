/**
 * High Protein Recommendations
 * GET /api/recipes/recommendations/high-protein
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') 
      ? parseInt(request.nextUrl.searchParams.get('limit')!) 
      : 10;

    // Get high protein recipes (dietType = High-Protein or protein > 20g)
    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          { dietType: 'High-Protein' },
          { protein: { gte: 20 } },
        ],
        protein: { not: null },
      },
      orderBy: { protein: 'desc' },
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
        suitableFor: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error('Error fetching high-protein recipes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

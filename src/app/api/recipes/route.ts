/**
 * Recipes API Endpoint
 * GET /api/recipes - Get all recipes with optional filters
 * Query params: dietType, prepDifficulty, estimatedCostLevel, suitableFor, category, search
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get filter parameters
    const dietType = searchParams.get('dietType');
    const prepDifficulty = searchParams.get('prepDifficulty');
    const estimatedCostLevel = searchParams.get('estimatedCostLevel');
    const suitableFor = searchParams.get('suitableFor');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const skip = searchParams.get('skip') ? parseInt(searchParams.get('skip')!) : undefined;

    // Build where clause
    const where: {
      dietType?: string;
      prepDifficulty?: string;
      estimatedCostLevel?: string;
      suitableFor?: string;
      category?: string;
      calories?: { not: null; lte?: number };
      protein?: { not: null; gte?: number };
      OR?: Array<{ title: { contains: string; mode: 'insensitive' } } | { ingredients: { contains: string; mode: 'insensitive' } }>;
    } = {};

    if (dietType) {
      where.dietType = dietType;
    }
    if (prepDifficulty) {
      where.prepDifficulty = prepDifficulty;
    }
    if (estimatedCostLevel) {
      where.estimatedCostLevel = estimatedCostLevel;
    }
    if (suitableFor) {
      where.suitableFor = suitableFor;
    }
    if (category) {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { ingredients: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    // Fetch recipes
    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: { title: 'asc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        url: true,
        category: true,
        cookingTime: true,
        portion: true,
        ingredients: true,
        steps: true,
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
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

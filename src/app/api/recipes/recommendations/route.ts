/**
 * Recipe Recommendations API Endpoint
 * GET /api/recipes/recommendations - Get personalized recipe recommendations
 * Query params: dietType, suitableFor, maxCalories, minProtein
 * 
 * Special endpoints:
 * - GET /api/recipes/recommendations/low-cal-breakfast - Low calorie breakfast recipes
 * - GET /api/recipes/recommendations/high-protein - High protein recipes
 * - GET /api/recipes/recommendations/quick-meals - Quick meals (< 20 min)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get filter parameters for personalized recommendations
    const dietType = searchParams.get('dietType');
    const suitableFor = searchParams.get('suitableFor');
    const maxCalories = searchParams.get('maxCalories') ? parseFloat(searchParams.get('maxCalories')!) : undefined;
    const minProtein = searchParams.get('minProtein') ? parseFloat(searchParams.get('minProtein')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    // Build where clause
    const where: {
      dietType?: string;
      suitableFor?: string;
      calories?: { not: null; lte?: number };
      protein?: { not: null; gte?: number };
    } = {};

    if (dietType) {
      where.dietType = dietType;
    }
    if (suitableFor) {
      where.suitableFor = suitableFor;
    }
    if (maxCalories !== undefined) {
      where.calories = { ...where.calories, not: null, lte: maxCalories };
    }
    if (minProtein !== undefined) {
      where.protein = { ...where.protein, not: null, gte: minProtein };
    }
    
    // Exclude recipes with missing nutritional data for better recommendations
    if (!where.calories) {
      where.calories = { not: null };
    }
    if (!where.protein) {
      where.protein = { not: null };
    }

    // Fetch recommended recipes
    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: { calories: 'asc' },
      take: limit,
      select: {
        id: true,
        title: true,
        url: true,
        category: true,
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
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

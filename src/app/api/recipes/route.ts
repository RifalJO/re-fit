/**
 * Recipes API Endpoint
 * GET /api/recipes - Get all recipes with optional filters
 * Query params: dietType, prepDifficulty, estimatedCostLevel, suitableFor, category, search
 *              minCalories, maxCalories, minProtein, maxProtein, minCarbs, maxCarbs, minFat, maxFat
 *              minCookingTime, maxCookingTime, minPortion, maxPortion
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

    // Numeric filters
    const minCalories = searchParams.get('minCalories');
    const maxCalories = searchParams.get('maxCalories');
    const minProtein = searchParams.get('minProtein');
    const maxProtein = searchParams.get('maxProtein');
    const minCarbs = searchParams.get('minCarbs');
    const maxCarbs = searchParams.get('maxCarbs');
    const minFat = searchParams.get('minFat');
    const maxFat = searchParams.get('maxFat');
    const minCookingTime = searchParams.get('minCookingTime');
    const maxCookingTime = searchParams.get('maxCookingTime');
    const minPortion = searchParams.get('minPortion');
    const maxPortion = searchParams.get('maxPortion');

    // Build where clause
    const where: {
      dietType?: string;
      prepDifficulty?: string;
      estimatedCostLevel?: string;
      suitableFor?: string;
      category?: string;
      calories?: { not: null; gte?: number; lte?: number };
      protein?: { not: null; gte?: number; lte?: number };
      carbs?: { not: null; gte?: number; lte?: number };
      fat?: { not: null; gte?: number; lte?: number };
      cookingTime?: { not: null; gte?: number; lte?: number };
      portion?: { not: null; gte?: number; lte?: number };
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

    // Apply numeric filters
    if (minCalories || maxCalories) {
      where.calories = { not: null };
      if (minCalories) where.calories.gte = parseFloat(minCalories);
      if (maxCalories) where.calories.lte = parseFloat(maxCalories);
    }

    if (minProtein || maxProtein) {
      where.protein = { not: null };
      if (minProtein) where.protein.gte = parseFloat(minProtein);
      if (maxProtein) where.protein.lte = parseFloat(maxProtein);
    }

    if (minCarbs || maxCarbs) {
      where.carbs = { not: null };
      if (minCarbs) where.carbs.gte = parseFloat(minCarbs);
      if (maxCarbs) where.carbs.lte = parseFloat(maxCarbs);
    }

    if (minFat || maxFat) {
      where.fat = { not: null };
      if (minFat) where.fat.gte = parseFloat(minFat);
      if (maxFat) where.fat.lte = parseFloat(maxFat);
    }

    if (minCookingTime || maxCookingTime) {
      where.cookingTime = { not: null };
      if (minCookingTime) where.cookingTime.gte = parseInt(minCookingTime);
      if (maxCookingTime) where.cookingTime.lte = parseInt(maxCookingTime);
    }

    if (minPortion || maxPortion) {
      where.portion = { not: null };
      if (minPortion) where.portion.gte = parseInt(minPortion);
      if (maxPortion) where.portion.lte = parseInt(maxPortion);
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

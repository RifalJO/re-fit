/**
 * Single Recipe Detail Endpoint
 * GET /api/recipes/[title] - Get recipe by title
 * PUT /api/recipes/[title] - Update recipe
 * DELETE /api/recipes/[title] - Delete recipe
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET single recipe by title
export async function GET(
  request: NextRequest,
  { params }: { params: { title: string } }
) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { title: decodeURIComponent(params.title) },
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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}

// PUT update recipe by title
export async function PUT(
  request: NextRequest,
  { params }: { params: { title: string } }
) {
  try {
    const body = await request.json();
    
    const recipe = await prisma.recipe.update({
      where: { title: decodeURIComponent(params.title) },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}

// DELETE recipe by title
export async function DELETE(
  request: NextRequest,
  { params }: { params: { title: string } }
) {
  try {
    await prisma.recipe.delete({
      where: { title: decodeURIComponent(params.title) },
    });

    return NextResponse.json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}

/**
 * Debug Script - Verify Database Content (Simple Version)
 * Run: npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/debug-db.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Debugging Database...\n');

  // Count total recipes
  const totalRecipes = await prisma.recipe.count();
  console.log(`📊 Total recipes in database: ${totalRecipes}`);

  // Get first 5 recipes
  const sampleRecipes = await prisma.recipe.findMany({
    take: 5,
  });

  console.log('\n📝 Sample recipes:');
  sampleRecipes.forEach((recipe, i) => {
    console.log(`\n${i + 1}. ${recipe.title}`);
    console.log(`   Image URL: ${recipe.imageUrl ? '✅ Present' : '❌ Missing'}`);
    if (recipe.imageUrl) {
      console.log(`   URL preview: ${recipe.imageUrl.substring(0, 60)}...`);
    }
    console.log(`   Calories: ${recipe.calories ?? 'N/A'} kcal`);
  });

  // Count recipes with images
  let withImages = 0;
  let withoutImages = 0;
  
  const allRecipes = await prisma.recipe.findMany({
    select: {
      imageUrl: true,
    },
  });

  allRecipes.forEach(recipe => {
    if (recipe.imageUrl) {
      withImages++;
    } else {
      withoutImages++;
    }
  });

  console.log(`\n🖼️  Recipes with images: ${withImages}`);
  console.log(`🚫 Recipes without images: ${withoutImages}`);

  console.log('\n✅ Debug completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

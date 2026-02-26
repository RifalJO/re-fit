/**
 * Umami-Chef Database Seed Script
 * Imports recipes from recipes_data_app_ready.csv into PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Read the CSV file - look in project root
  const csvPath = path.join(__dirname, '..', 'recipes_data_app_ready.csv');

  console.log(`📂 Loading recipes from: ${csvPath}`);

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found: ${csvPath}`);
    console.log('Please ensure recipes_data_app_ready.csv is in the re-fit project root.');
    return;
  }

  const csvData = fs.readFileSync(csvPath, 'utf-8');
  
  // Parse CSV
  const records: Record<string, any>[] = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  });

  console.log(`📊 Found ${records.length} recipes to import...`);

  let successCount = 0;
  let errorCount = 0;

  // Process each recipe
  for (const record of records) {
    try {
      // Parse numeric values
      const cookingTime = record.cooking_time ? parseInt(record.cooking_time, 10) : null;
      const portion = record.portion ? parseInt(record.portion, 10) : null;
      const calories = record.calories ? parseFloat(record.calories) : null;
      const protein = record.protein ? parseFloat(record.protein) : null;
      const carbs = record.carbs ? parseFloat(record.carbs) : null;
      const fat = record.fat ? parseFloat(record.fat) : null;

      // Create or update recipe
      await prisma.recipe.upsert({
        where: {
          title: record.title,
        },
        update: {
          url: record.url,
          category: record.category,
          cookingTime,
          portion,
          ingredients: record.ingredients,
          steps: record.steps,
          calories,
          protein,
          carbs,
          fat,
          imageUrl: record.image_url,
          dietType: record.diet_type,
          prepDifficulty: record.prep_difficulty,
          estimatedCostLevel: record.estimated_cost_level,
          suitableFor: record.suitable_for,
        },
        create: {
          title: record.title,
          url: record.url,
          category: record.category,
          cookingTime,
          portion,
          ingredients: record.ingredients,
          steps: record.steps,
          calories,
          protein,
          carbs,
          fat,
          imageUrl: record.image_url,
          dietType: record.diet_type,
          prepDifficulty: record.prep_difficulty,
          estimatedCostLevel: record.estimated_cost_level,
          suitableFor: record.suitable_for,
        },
      });

      successCount++;
      
      // Log progress every 100 recipes
      if (successCount % 100 === 0) {
        console.log(`   ✅ Imported ${successCount} recipes...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Error importing recipe "${record.title}":`, error);
    }
  }

  console.log('\n✅ Seed completed!');
  console.log(`   📈 Successfully imported: ${successCount} recipes`);
  console.log(`   ⚠️  Errors: ${errorCount} recipes`);

  // Display summary statistics
  const dietTypeStats = await prisma.recipe.groupBy({
    by: ['dietType'],
    _count: true,
  });
  console.log('\n🥗 Diet Type Distribution:');
  dietTypeStats.forEach(stat => {
    console.log(`   - ${stat.dietType || 'N/A'}: ${stat._count}`);
  });

  const difficultyStats = await prisma.recipe.groupBy({
    by: ['prepDifficulty'],
    _count: true,
  });
  console.log('\n🕒 Difficulty Distribution:');
  difficultyStats.forEach(stat => {
    console.log(`   - ${stat.prepDifficulty || 'N/A'}: ${stat._count}`);
  });

  const costStats = await prisma.recipe.groupBy({
    by: ['estimatedCostLevel'],
    _count: true,
  });
  console.log('\n💸 Cost Level Distribution:');
  costStats.forEach(stat => {
    console.log(`   - ${stat.estimatedCostLevel || 'N/A'}: ${stat._count}`);
  });

  const suitableStats = await prisma.recipe.groupBy({
    by: ['suitableFor'],
    _count: true,
  });
  console.log('\n🍽️ Suitable For Distribution:');
  suitableStats.forEach(stat => {
    console.log(`   - ${stat.suitableFor || 'N/A'}: ${stat._count}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

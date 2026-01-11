import { db } from '../db';
import { measurements } from '../db/schema';
import { sql } from 'drizzle-orm';

const SEED_DURATION_HOURS = 24;
const INTERVAL_SECONDS = 10;
const MAX_VOLTAGE = 5;
const VOLTAGE_STEP = 0.01;

async function seed() {
  console.log('Starting seed...');

  // Clear existing data? Maybe better to truncate for a fresh start.
  await db.execute(sql`TRUNCATE TABLE ${measurements} RESTART IDENTITY`);

  const now = new Date();
  const startTime = new Date(now.getTime() - SEED_DURATION_HOURS * 60 * 60 * 1000);
  const totalSteps = (SEED_DURATION_HOURS * 3600) / INTERVAL_SECONDS;

  let currentVoltage = 0;
  let direction = 1; // 1 for up, -1 for down
  
  const valuesBatch = [];
  const BATCH_SIZE = 1000;

  for (let i = 0; i < totalSteps; i++) {
    const timestamp = new Date(startTime.getTime() + i * INTERVAL_SECONDS * 1000);
    
    valuesBatch.push({
      voltage: Number(currentVoltage.toFixed(2)),
      timestamp,
    });

    if (valuesBatch.length >= BATCH_SIZE) {
      await db.insert(measurements).values(valuesBatch);
      valuesBatch.length = 0;
      process.stdout.write(`\rInserted ${i + 1} / ${totalSteps} records`);
    }

    currentVoltage += direction * VOLTAGE_STEP;

    if (currentVoltage >= MAX_VOLTAGE) {
      currentVoltage = MAX_VOLTAGE;
      direction = -1;
    } else if (currentVoltage <= 0) {
      currentVoltage = 0;
      direction = 1;
    }
  }

  if (valuesBatch.length > 0) {
    await db.insert(measurements).values(valuesBatch);
  }

  console.log('\nSeeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

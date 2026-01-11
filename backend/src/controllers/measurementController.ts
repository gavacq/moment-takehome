import { Request, Response } from 'express';
import { db } from '../db';
import { measurements } from '../db/schema';
import { gt, lt, and, desc, asc, sql } from 'drizzle-orm';
import { z } from 'zod';

const measurementSchema = z.object({
  voltage: z.number(),
  timestamp: z.string().datetime(),
});

export const addMeasurement = async (req: Request, res: Response) => {
  try {
    const validation = measurementSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ error: validation.error.issues });
      return;
    }

    const { voltage, timestamp } = validation.data;

    const result = await db.insert(measurements).values({
      voltage,
      timestamp: new Date(timestamp),
    }).returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error adding measurement:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMeasurements = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;

    const conditions = [];

    if (start && typeof start === 'string') {
      const startDate = new Date(start);
      if (isNaN(startDate.getTime())) {
        res.status(400).json({ error: 'Invalid start date format' });
        return;
      }
      conditions.push(gt(measurements.timestamp, startDate));
    }

    if (end && typeof end === 'string') {
      const endDate = new Date(end);
      if (isNaN(endDate.getTime())) {
        res.status(400).json({ error: 'Invalid end date format' });
        return;
      }
      conditions.push(lt(measurements.timestamp, endDate));
    }

    // Apply filters if any
    let result;
    if (conditions.length > 0) {
      const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
      result = await db.query.measurements.findMany({
        where: whereCondition,
        orderBy: [asc(measurements.timestamp)],
      });
    } else {
      result = await db.query.measurements.findMany({
        orderBy: [asc(measurements.timestamp)],
      });
    }

    res.json(result);

  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const reseedMeasurements = async (req: Request, res: Response) => {
  try {
    const SEED_DURATION_HOURS = 24;
    const INTERVAL_SECONDS = 10;
    const MAX_VOLTAGE = 5;
    const VOLTAGE_STEP = 0.01;

    // Clear existing data
    await db.execute(sql`TRUNCATE TABLE ${measurements} RESTART IDENTITY`);

    const now = new Date();
    const startTime = new Date(now.getTime() - SEED_DURATION_HOURS * 60 * 60 * 1000);
    const totalSteps = (SEED_DURATION_HOURS * 3600) / INTERVAL_SECONDS;

    let currentVoltage = 0;
    let direction = 1;

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

    res.json({
      message: 'Database reseeded successfully',
      recordsCreated: totalSteps,
      startTime: startTime.toISOString(),
      endTime: now.toISOString()
    });

  } catch (error) {
    console.error('Error reseeding measurements:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const generateLiveMeasurements = async (req: Request, res: Response) => {
  try {
    const lastMeasurements = await db.query.measurements.findMany({
      orderBy: [desc(measurements.timestamp)],
      limit: 2,
    });

    let currentVoltage = 0;
    let direction = 1;
    let lastTimestamp = new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to 24h ago if empty

    if (lastMeasurements.length > 0) {
      currentVoltage = lastMeasurements[0].voltage;
      lastTimestamp = lastMeasurements[0].timestamp;

      if (lastMeasurements.length > 1) {
        direction = lastMeasurements[0].voltage >= lastMeasurements[1].voltage ? 1 : -1;
      }
      // If at boundaries, force direction
      if (currentVoltage >= 5) direction = -1;
      if (currentVoltage <= 0) direction = 1;
    }

    const now = new Date();
    // Start from the next interval after the last timestamp
    const nextIntervalTime = new Date(lastTimestamp.getTime() + 10000); // 10s after last

    if (nextIntervalTime > now) {
      return res.json({
        message: 'Data is already up to date',
        recordsCreated: 0
      });
    }

    const INTERVAL_SECONDS = 10;
    const totalSteps = Math.floor((now.getTime() - lastTimestamp.getTime()) / 1000 / INTERVAL_SECONDS);
    const MAX_VOLTAGE = 5;
    const VOLTAGE_STEP = 0.01;

    const valuesBatch = [];
    const BATCH_SIZE = 1000;

    for (let i = 1; i <= totalSteps; i++) {
      const timestamp = new Date(lastTimestamp.getTime() + i * INTERVAL_SECONDS * 1000);

      currentVoltage += direction * VOLTAGE_STEP;

      if (currentVoltage >= MAX_VOLTAGE) {
        currentVoltage = MAX_VOLTAGE;
        direction = -1;
      } else if (currentVoltage <= 0) {
        currentVoltage = 0;
        direction = 1;
      }

      valuesBatch.push({
        voltage: Number(currentVoltage.toFixed(2)),
        timestamp,
      });

      if (valuesBatch.length >= BATCH_SIZE) {
        await db.insert(measurements).values(valuesBatch);
        valuesBatch.length = 0;
      }
    }

    if (valuesBatch.length > 0) {
      await db.insert(measurements).values(valuesBatch);
    }

    res.json({
      message: 'Live data generated successfully',
      recordsCreated: totalSteps,
      startTime: nextIntervalTime.toISOString(),
      endTime: now.toISOString()
    });

  } catch (error) {
    console.error('Error generating live measurements:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

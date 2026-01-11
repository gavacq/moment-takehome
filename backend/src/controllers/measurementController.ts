import { Request, Response } from 'express';
import { db } from '../db';
import { measurements } from '../db/schema';
import { gt, desc, asc } from 'drizzle-orm';
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
    const { after } = req.query;

    if (after && typeof after === 'string') {
      const afterDate = new Date(after);
      if (isNaN(afterDate.getTime())) {
         res.status(400).json({ error: 'Invalid date format' });
         return;
      }

      const result = await db.query.measurements.findMany({
        where: gt(measurements.timestamp, afterDate),
        orderBy: [asc(measurements.timestamp)],
      });
      res.json(result);
    } else {
       // If no filter is provided, maybe return all or limit?
       // The requirement says "query all voltage measurements taken after a provided timestamp".
       // It doesn't explicitly say what to do if no timestamp is provided, but typically we might return recent ones or an empty list or all.
       // For safety, let's return all but maybe the user will always provide 'after'.
       // Let's just return all for now, ordered by timestamp.
       const result = await db.query.measurements.findMany({
         orderBy: [asc(measurements.timestamp)],
       });
       res.json(result);
    }

  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

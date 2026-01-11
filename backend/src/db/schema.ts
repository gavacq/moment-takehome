import { pgTable, serial, doublePrecision, timestamp } from 'drizzle-orm/pg-core';

export const measurements = pgTable('measurements', {
  id: serial('id').primaryKey(),
  voltage: doublePrecision('voltage').notNull(),
  timestamp: timestamp('timestamp').notNull(),
});

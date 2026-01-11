import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { addMeasurement, getMeasurements } from '../controllers/measurementController';

// Mock the db module
vi.mock('../db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    query: {
      measurements: {
        findMany: vi.fn(),
      },
    },
  },
}));

import { db } from '../db';

describe('Measurement Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    res = {
      status: statusMock,
      json: jsonMock,
    };
    vi.clearAllMocks();
  });

  describe('addMeasurement', () => {
    it('should add a measurement successfully', async () => {
      req = {
        body: {
          voltage: 4.5,
          timestamp: '2023-10-27T10:00:00Z',
        },
      };

      (db.insert as any).mockImplementation(() => ({
        values: () => ({
          returning: async () => [{ id: 1, voltage: 4.5, timestamp: new Date('2023-10-27T10:00:00Z') }],
        }),
      }));

      await addMeasurement(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        voltage: 4.5,
      }));
    });

    it('should return 400 for invalid data', async () => {
      req = {
        body: {
          voltage: 'invalid', // Should be number
        },
      };

      await addMeasurement(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });
  });
});

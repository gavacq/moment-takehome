const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Measurement {
  id: number;
  voltage: number;
  timestamp: string;
}

export const fetchMeasurements = async (start?: Date, end?: Date): Promise<Measurement[]> => {
  const params = new URLSearchParams();
  if (start) {
    params.append('start', start.toISOString());
  }
  if (end) {
    params.append('end', end.toISOString());
  }

  const response = await fetch(`${API_URL}/measurements?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch measurements');
  }

  return response.json();
};

export const reseedDatabase = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/measurements/reseed`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to reseed database');
  }
};

export const generateLiveMeasurements = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/measurements/generate-live`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to generate live measurements');
  }
};
export const postMeasurement = async (voltage: number, timestamp: Date): Promise<Measurement> => {
  const response = await fetch(`${API_URL}/measurements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      voltage,
      timestamp: timestamp.toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to post measurement');
  }

  return response.json();
};

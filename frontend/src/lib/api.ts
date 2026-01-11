const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Measurement {
  id: number;
  voltage: number;
  timestamp: string;
}

export const fetchMeasurements = async (after?: Date): Promise<Measurement[]> => {
  const params = new URLSearchParams();
  if (after) {
    params.append('after', after.toISOString());
  }

  const response = await fetch(`${API_URL}/measurements?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch measurements');
  }

  return response.json();
};

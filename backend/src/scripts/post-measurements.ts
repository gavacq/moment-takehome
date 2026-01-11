#!/usr/bin/env tsx
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const INTERVAL_MS = 10000; // 10 seconds
const MAX_VOLTAGE = 5;
const VOLTAGE_STEP = 0.01;

let currentVoltage = 0;
let direction = 1; // 1 for up, -1 for down

async function postMeasurement(voltage: number) {
  const timestamp = new Date().toISOString();
  
  try {
    const response = await fetch(`${API_URL}/measurements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        voltage: Number(voltage.toFixed(2)),
        timestamp,
      }),
    });

    if (!response.ok) {
      console.error(`Failed to post measurement: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    console.log(`Posted: ${data.voltage}V at ${new Date(data.timestamp).toLocaleTimeString()}`);
  } catch (error) {
    console.error('Error posting measurement:', error);
  }
}

async function startPosting() {
  console.log('Starting to post measurements every 10 seconds...');
  console.log('Press Ctrl+C to stop\n');

  // Post immediately
  await postMeasurement(currentVoltage);

  setInterval(async () => {
    // Update voltage
    currentVoltage += direction * VOLTAGE_STEP;

    if (currentVoltage >= MAX_VOLTAGE) {
      currentVoltage = MAX_VOLTAGE;
      direction = -1;
    } else if (currentVoltage <= 0) {
      currentVoltage = 0;
      direction = 1;
    }

    await postMeasurement(currentVoltage);
  }, INTERVAL_MS);
}

startPosting();

# Takehome challenge for Moment Energy Fullstack Developer position

## Description

This is a takehome challenge for the Moment Energy Fullstack Developer position. The challenge is to create a web app that stores and visualizes time series voltage data from a battery.

## Technologies

- React
- TypeScript
- shadcn ui
- tailwindcss
- shadcn charts
- Node.js
- Express
- drizzle-orm
- hosting on render

## API

- Receive and store a voltage measurement, consisting of both a voltage and a
timestamp.
- The ability to query all voltage measurements taken after a provided timestamp. The response shall consist of a list of objects containing both the voltage value
and the corresponding timestamp, starting from the earliest timestamp.


## Database

- A postgres database shall be used to store the voltage measurements.
- The database shall have a single table, called "measurements", with the following columns:
  - id (integer, primary key)
  - voltage (float)
  - timestamp (datetime)
- https://render.com/docs/postgresql

### Seeding
The developed database should contain mocked voltage data taken over the last 24 hours,
measured at an interval of 10s. The voltage measurements should start at 0V, and be
incremented by 0.01V every timestep until 5V is reached. Once 5V is reached, the voltage
should be decremented by 0.01V every timestep until 0V is reached. Repeat the process until
24 hours' worth of data is populated.
You will likely require a simple script to populate the database.

## Deployment

- https://render.com/articles/how-to-deploy-full-stack-applications-without-devops-expertise1


## UI
- [insert wireframes here]
As a user I can:
1) Select a time range from a drop-down menu with the following options:
● 1m
● 15m
● 1hr
● 6hr
● 12hr
2) Refresh the voltage chart using the selected time range via a refresh button.

## Other requirements
- add basic logging
- add basic testing with vitest

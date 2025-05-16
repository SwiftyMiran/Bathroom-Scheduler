# Bathroom Scheduler

A simple application to schedule bathroom usage and avoid conflicts.

## Features

- Schedule bathroom usage with start and end times
- View all upcoming reservations
- Delete existing reservations
- Conflict detection (prevents overlapping schedules)
- Data stored in MongoDB Atlas cloud database

## Prerequisites

- Node.js (v14+ recommended)

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the MongoDB credentials in the `.env` file if needed

## Running the Application

1. Start the server:

   ```bash
   node index.js
   ```

   Or use npm:

   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:1530
   ```

## API Endpoints

The application provides the following RESTful API endpoints:

- `GET /api/reservations`: Get all bathroom reservations
- `POST /api/reservations`: Create a new reservation
- `GET /api/reservations/:id`: Get a specific reservation
- `PUT /api/reservations/:id`: Update a specific reservation
- `DELETE /api/reservations/:id`: Delete a specific reservation

## Database

The application uses MongoDB Atlas to store reservation data in the cloud. No local database installation is required.

## Project Structure

- `Main/index.js`: Express server setup, MongoDB connection, and API routes
- `Main/public/index.html`: Frontend interface for the bathroom scheduler
- `DB/`: Directory for MongoDB data (when using a local MongoDB instance)

import mongoose from 'mongoose';

let connectionPromise;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is missing');

  connectionPromise = mongoose.connect(connectionString);
  try {
    return await connectionPromise;
  } finally {
    connectionPromise = undefined;
  }
}

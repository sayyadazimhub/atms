import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

export async function withTransaction(work) {
  await connectDB();
  const session = await mongoose.startSession();

  try {
    let result;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}

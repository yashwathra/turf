import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("MongoDB URI not found in .env");

let cached = (global as any).mongoose || { conn: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(MONGODB_URI, {
    dbName: 'TURF',
  });

  return cached.conn;
}

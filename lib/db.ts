import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MongoDB URI not found in .env");

type MongooseCache = {
  conn: typeof mongoose | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongooseCache || {
  conn: null,
};

export async function connectDB() {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(MONGODB_URI, {
    dbName: "TURF",
  });

  globalWithMongoose.mongooseCache = cached;

  return cached.conn;
}

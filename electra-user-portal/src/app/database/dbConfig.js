import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("MONGO_URL not defined in environment");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Creates/reuses a MongoDB connection for Next.js route handlers.
 *
 * @returns {Promise<typeof mongoose>}
 */
export async function ConnectDb() {
  // Reuse connection in dev/hot-reload to avoid creating many sockets.
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Initialize once; subsequent callers await the same promise.
    cached.promise = mongoose.connect(MONGO_URL, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // fail fast
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}

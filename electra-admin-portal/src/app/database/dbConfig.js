import mongoose, { connection } from "mongoose";

/**
 * Opens MongoDB connection for admin portal APIs.
 * Existing connections are reused by mongoose internally.
 */
export async function ConnectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    connection.on("connected", () => {
      console.log("database connected sucessfully!");
    });
    connection.on("error", (err) => {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
  }
}

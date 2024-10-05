import mongoose, { connection } from "mongoose";
export async function ConnectDb() {
  try {
    await mongoose.connect(`mongodb+srv://Nithin:nk0402246@cluster0.krwjt.mongodb.net`);
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

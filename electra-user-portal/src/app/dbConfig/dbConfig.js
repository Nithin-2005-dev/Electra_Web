const { default: mongoose, connection } = require("mongoose");

export const connectDb = async () => {
  console.log("entered");
  try {
    await mongoose.connect(process.env.MONGO_URL);
    connection.on("connected", () => {
      console.log("database connected sucessfully!");
    });
    connection.on("error", (err) => {
      console.log(err);
    });
  } catch (err) {
    console.log("something went wrong!!");
    console.log(err);
  }
};

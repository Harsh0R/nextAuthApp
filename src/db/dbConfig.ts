import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      alert("Mongo URL not found");
      return;
    }
    mongoose.connect(process.env.MONGO_URL);
    const connection = mongoose.connection;

    connection.on("connection", () => {
      console.log("Mongo is Connected..");
    });
    connection.on("error", (err) => {
      console.log("Mongo connection error => ", err);
      process.exit();
    });
  } catch (error) {
    console.log("Somthing went wrong while connecting to database => ", error);
  }
};


export default connectDB;
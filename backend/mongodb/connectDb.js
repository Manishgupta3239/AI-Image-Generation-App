import mongoose from "mongoose";

const connectDB =async(url) => {
  mongoose.set("strictQuery", true);
  try {
    const connect = await mongoose.connect(url);
    if (connect) {
      console.log("Connected To Database");
      console.log("Database Name:", connect.connection.name);
      console.log("Connection State:", connect.connection.readyState);
    }
  } catch (error) {
    console.log("Error in Connecting To Database", error.message);
  }
};
export default connectDB;

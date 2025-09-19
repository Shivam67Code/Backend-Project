import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

    console.log(`MONGODB CONNECTED SUCCESSFULLY ☘️😊! ! !  DB HOST : ${connectionInstance}`);

    console.log(`The connection instance is : ${connectionInstance}`);

  } catch (error) {
    console.error("MONGO_DB connection error : ", error);
    process.exit(1);
  }
}

export default connectDB;
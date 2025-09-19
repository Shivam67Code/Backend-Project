import dotenv from 'dotenv';
import connectDB from "./db/db.js";
import express from 'express';

const app = express();

dotenv.config({
  path: './.env'  // Fixed: should be './.env' not './env'
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error : ", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at http://localhost:${process.env.PORT || 8000}`);  // Fixed: http not https for local development
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection failed !!!", err);
  });
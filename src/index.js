import dotenv from 'dotenv';
import connectDB from "./db/db.js";
dotenv.config({
  path: './env'
});
connectDB()
  .then(() => {

    app.on("error", (error) => {
      console.log("Error : ", error);
      throw error;
    })
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at https://localhost:${process.env.PORT}`);
    })
  })
  .catch((err) => {
    console.log("Mongo DB connection failed !!!", err);
  })
import dotenv from 'dotenv';
import connectDB from "./db/db.js";
import express from 'express';
import { defaultRoute, healthRoute } from './routes/defaultRoute.js';
import { app } from './app.js';
dotenv.config({
  path: './.env'
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error : ", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️   Server is running at http://localhost:${process.env.PORT || 8000}`);  // Fixed: http not https for local development
    });

    app.get('/', defaultRoute);
    app.get("/health", healthRoute);
    app.get("/api/health", healthRoute);
  })
  .catch((err) => {
    console.log("Mongo DB connection failed !!!", err);
  });
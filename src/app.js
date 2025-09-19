import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

// app.use() is used mostly in case of using middleware or configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))

// besi json k req nai aabe naita server crash kairdetai many json requests so setting it's limit
app.use(express.json({
  limit: "16kb"
}))

// to handle data coming from url= using urlencoded
app.use(express.urlencoded({
  extended: true,
  limit: "16kb"
}))

// to temporarily store images or favicon
app.use(express.static("public"))

// server sa user k browser sa cookies access and set kariske so using this
app.use(cookieParser())



export { app } 
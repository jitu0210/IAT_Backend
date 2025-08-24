import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import formRoutes from "./routes/form.routes.js";
import projectRoutes from "./routes/project.routes.js";
import ratingRoutes from "./routes/rating.routes.js"
import groupRoutes from "./routes/group.routes.js"
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://iat-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());

connectDB()

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/form", formRoutes);
app.use("/api/v1/projects",projectRoutes)
app.use("/api/v1/ratings",ratingRoutes)
app.use("/api/v1/groups",groupRoutes)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

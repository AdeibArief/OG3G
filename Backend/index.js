import { configDotenv } from "dotenv";
import { connectDb } from "./config/db.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import matchRoutes from "./routes/matches.js";

configDotenv();

connectDb();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "https://og-3-g.vercel.app", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);

app.get("/", (req, res) => {
  res.json({ message: "OG3G API is running" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));

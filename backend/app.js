import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { allowedOrigins } from "./src/config/app.config.js";
import { attachUser } from "./src/middleware/auth.middleware.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
import apiRouter from "./src/routes/index.js";
import { redirectShortUrl } from "./src/controllers/url.controller.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachUser);

app.use("/uploads", express.static("uploads"));

app.use("/api", apiRouter);

app.get("/:shorturl", redirectShortUrl);

app.use(errorHandler);

export default app;

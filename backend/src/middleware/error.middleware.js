import { AppError } from "../utils/appError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "MulterError" || err.message?.includes("permitted for secure vault storage")) {
    return res.status(400).json({
      success: false,
      message: err.message || "Invalid file format",
    });
  }

  console.error("Unhandled Error:", err);
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

import User from "../models/user.model.js";
import { verifyToken } from "../utils/helpers.js";
import { UnauthorizedError } from "../utils/appError.js";

export const attachUser = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = req.cookies?.accessToken || bearerToken;
    if (!token) {
      req.user = null;
      return next();
    }

    const userId = verifyToken(token);
    if (!userId) {
      req.user = null;
      return next();
    }

    const user = await User.findById(userId).select("-password");
    req.user = user || null;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }
  next();
};

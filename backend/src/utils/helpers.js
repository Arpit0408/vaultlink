import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

export const generateNanoId = (length = 6) => {
  return nanoid(length);
};

export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

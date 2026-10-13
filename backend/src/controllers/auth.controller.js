import User from "../models/user.model.js";
import { signToken } from "../utils/helpers.js";
import { cookieOptions } from "../config/app.config.js";
import { ConflictError, UnauthorizedError, BadRequestError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Name, email and password are required");
  }

  const cleanEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } });
  if (existingUser) {
    throw new ConflictError("User already exists with this email");
  }

  const user = await User.create({ name: name.trim(), email: cleanEmail, password: password.trim() });
  const token = signToken({ id: user._id });

  res.cookie("accessToken", token, cookieOptions);
  return res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } }).select("+password");
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password.trim());
  if (!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = signToken({ id: user._id });

  res.cookie("accessToken", token, cookieOptions);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (name && name.trim()) user.name = name.trim();
  if (email && email.trim() && email.trim() !== user.email) {
    const existing = await User.findOne({ email: email.trim() });
    if (existing) {
      throw new ConflictError("Email is already registered");
    }
    user.email = email.trim();
  }
  if (password && password.trim()) {
    user.password = password.trim();
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

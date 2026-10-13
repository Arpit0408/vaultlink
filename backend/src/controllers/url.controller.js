import VaultItem from "../models/vaultItem.model.js";
import { generateNanoId } from "../utils/helpers.js";
import { ConflictError, NotFoundError, BadRequestError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createShortUrl = asyncHandler(async (req, res) => {
  const { url, slug } = req.body;

  if (!url) {
    throw new BadRequestError("URL is required");
  }

  const shortCode = slug ? slug.trim() : generateNanoId(6);

  const existing = await VaultItem.findOne({ short: shortCode });
  if (existing) {
    throw new ConflictError("Short URL already exists");
  }

  const newUrl = await VaultItem.create({
    full: url,
    short: shortCode,
    type: "url",
    userId: req.user?._id || null,
  });

  const rawBase = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
  const baseUrl = rawBase.replace(/\/+$/, "");
  const shortUrl = `${baseUrl}/${newUrl.short}`;

  return res.status(201).send(shortUrl);
});

export const getUserUrls = asyncHandler(async (req, res) => {
  const urls = await VaultItem.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json({
    message: "success",
    urls,
  });
});

export const redirectShortUrl = asyncHandler(async (req, res) => {
  const { shorturl } = req.params;
  const item = await VaultItem.findOne({ short: shorturl });

  if (!item) {
    throw new NotFoundError("Short link not found");
  }

  if (item.expiresAt && new Date() > item.expiresAt) {
    return res.status(410).send("This VaultLink has expired");
  }

  if (item.type === "file" || item.isPasswordProtected || item.requireEmail) {
    const rawFrontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const frontendBase = rawFrontend.replace(/\/+$/, "");
    return res.redirect(`${frontendBase}/v/${shorturl}`);
  }

  await VaultItem.updateOne({ _id: item._id }, { $inc: { clicks: 1 } });
  return res.redirect(item.full);
});

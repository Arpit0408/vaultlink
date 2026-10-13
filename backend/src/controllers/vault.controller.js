import fs from "fs";
import path from "path";
import VaultItem from "../models/vaultItem.model.js";
import { generateNanoId } from "../utils/helpers.js";
import { applyWatermarkToImage } from "../services/watermark.service.js";
import { sendVaultShareEmail } from "../services/email.service.js";
import { uploadToImageKit } from "../services/imagekit.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BadRequestError, NotFoundError, ConflictError, UnauthorizedError } from "../utils/appError.js";

export const createVaultItem = asyncHandler(async (req, res) => {
  const {
    url,
    slug,
    watermarkText,
    expiresInMinutes,
    password,
    requireEmail,
    recipientEmail,
  } = req.body;

  const file = req.file;

  if (!file && !url) {
    throw new BadRequestError("Either an asset file or a destination URL is required");
  }

  const shortCode = slug ? slug.trim() : generateNanoId(6);

  const existing = await VaultItem.findOne({ short: shortCode });
  if (existing) {
    throw new ConflictError("Short identifier is already taken");
  }

  let itemType = file ? "file" : "url";
  let fileData = null;
  let isWatermarked = false;
  let finalWatermarkText = null;

  if (file) {
    const isImage = file.mimetype.startsWith("image/");
    let watermarkedPath = null;

    if (isImage && (watermarkText || watermarkText === undefined)) {
      finalWatermarkText = watermarkText || "VaultLink";
      watermarkedPath = await applyWatermarkToImage(file.path, finalWatermarkText);
      isWatermarked = true;
    }

    const uploadSourcePath = watermarkedPath || file.path;
    let cloudResult = null;

    try {
      cloudResult = await uploadToImageKit(uploadSourcePath, file.originalname);
    } catch (cloudErr) {
      console.error("Cloud storage error:", cloudErr.message);
    }

    fileData = {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      watermarkedPath: watermarkedPath || file.path,
      cloudUrl: cloudResult?.url || null,
      cloudFileId: cloudResult?.fileId || null,
    };

    if (cloudResult?.url) {
      try {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        if (watermarkedPath && fs.existsSync(watermarkedPath)) {
          fs.unlinkSync(watermarkedPath);
        }
      } catch (cleanupErr) {
        console.warn("Cleanup warning:", cleanupErr.message);
      }
    }
  }

  let expiresAt = null;
  if (expiresInMinutes && Number(expiresInMinutes) > 0) {
    expiresAt = new Date(Date.now() + Number(expiresInMinutes) * 60 * 1000);
  }

  const assignedPassword = password ? String(password).trim() : null;
  const isPasswordProtected = Boolean(assignedPassword && assignedPassword.length > 0);
  const isShared = req.body.isShared === "false" || req.body.saveOnly === "true" ? false : true;

  const vaultItem = await VaultItem.create({
    full: url || "",
    short: shortCode,
    type: itemType,
    file: fileData,
    watermarkText: finalWatermarkText,
    isWatermarked,
    password: assignedPassword,
    isPasswordProtected,
    expiresAt,
    requireEmail: requireEmail === "true" || requireEmail === true,
    recipientEmail: recipientEmail ? recipientEmail.trim() : null,
    isShared,
    userId: req.user?._id || null,
  });

  const rawBase = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
  const baseUrl = rawBase.replace(/\/+$/, "");
  const shortUrl = `${baseUrl}/${shortCode}`;

  if (recipientEmail && recipientEmail.trim()) {
    const mailResult = await sendVaultShareEmail({
      recipientEmail: recipientEmail.trim(),
      shortUrl,
      password: assignedPassword,
      fileName: file?.originalname || null,
      expiresAt,
      senderEmail: req.user?.email || null,
    });

    vaultItem.deliveredViaEmail = Boolean(mailResult.success);
    await vaultItem.save();

    return res.status(201).json({
      success: true,
      deliveredViaEmail: mailResult.success,
      recipientEmail: recipientEmail.trim(),
      shortUrl,
      short: shortCode,
      type: itemType,
      previewUrl: mailResult.previewUrl || null,
      emailError: mailResult.error || null,
      message: mailResult.success
        ? "Asset link and passcode dispatched directly to recipient email"
        : `Created, but email dispatch failed: ${mailResult.error}`,
    });
  }

  return res.status(201).json({
    success: true,
    deliveredViaEmail: false,
    shortUrl,
    short: shortCode,
    password: assignedPassword,
    isPasswordProtected,
    expiresAt,
    requireEmail: vaultItem.requireEmail,
    type: itemType,
  });
});

export const getVaultItemInfo = asyncHandler(async (req, res) => {
  const { shortcode } = req.params;
  const item = await VaultItem.findOne({ short: shortcode });

  if (!item) {
    throw new NotFoundError("Vault asset not found");
  }

  if (item.isShared === false) {
    return res.status(403).json({
      error: "This asset is stored privately in the vault and has not been shared by the owner.",
    });
  }

  if (item.expiresAt && new Date() > item.expiresAt) {
    return res.status(410).json({
      isExpired: true,
      error: "This VaultLink has expired",
    });
  }

  return res.status(200).json({
    short: item.short,
    type: item.type,
    isPasswordProtected: item.isPasswordProtected,
    requireEmail: item.requireEmail,
    fileName: item.file?.originalName || null,
    isExpired: false,
    clicks: item.clicks,
  });
});

export const accessVaultItem = asyncHandler(async (req, res) => {
  const { shortcode } = req.params;
  const { password, email } = req.body;

  const item = await VaultItem.findOne({ short: shortcode });

  if (!item) {
    throw new NotFoundError("Vault asset not found");
  }

  if (item.isShared === false) {
    return res.status(403).json({ error: "This asset is stored privately in the vault and has not been shared by the owner." });
  }

  if (item.expiresAt && new Date() > item.expiresAt) {
    return res.status(410).json({ error: "This VaultLink has expired" });
  }

  if (item.isPasswordProtected) {
    if (!password || String(password).trim() !== item.password) {
      throw new UnauthorizedError("Invalid passcode");
    }
  }

  if (item.requireEmail) {
    if (!email || !String(email).includes("@")) {
      throw new BadRequestError("Valid email is required to access this asset");
    }
    item.capturedEmails.push({ email: String(email).trim() });
  }

  item.clicks += 1;
  await item.save();

  if (item.type === "url") {
    return res.status(200).json({
      authorized: true,
      type: "url",
      targetUrl: item.full,
    });
  }

  const downloadUrl = `/api/vault/${item.short}/download${item.password ? `?passcode=${encodeURIComponent(item.password)}` : ""}`;

  return res.status(200).json({
    authorized: true,
    type: "file",
    fileName: item.file?.originalName,
    mimeType: item.file?.mimeType,
    size: item.file?.size,
    downloadUrl,
    cloudUrl: item.file?.cloudUrl || null,
    allowDownload: item.allowDownload !== false,
    watermarkText: item.watermarkText || (item.isWatermarked ? "CONFIDENTIAL" : null),
    isWatermarked: Boolean(item.isWatermarked),
  });
});

export const downloadVaultFile = asyncHandler(async (req, res) => {
  const { shortcode } = req.params;
  const passcode = req.query.passcode;

  const item = await VaultItem.findOne({ short: shortcode });

  if (!item || item.type !== "file") {
    throw new NotFoundError("File asset not found");
  }

  if (item.expiresAt && new Date() > item.expiresAt) {
    return res.status(410).json({ error: "This VaultLink has expired" });
  }

  if (item.isPasswordProtected && item.password !== passcode) {
    throw new UnauthorizedError("Unauthorized access");
  }

  if (item.allowDownload === false) {
    return res.status(403).json({ error: "Download is restricted for this document (View-Only Mode)" });
  }

  if (item.file?.cloudUrl) {
    return res.redirect(item.file.cloudUrl);
  }

  const targetFilePath =
    item.isWatermarked && item.file?.watermarkedPath
      ? item.file.watermarkedPath
      : item.file?.path;

  if (!targetFilePath || !fs.existsSync(targetFilePath)) {
    throw new NotFoundError("Physical file asset not found on disk");
  }

  return res.download(path.resolve(targetFilePath), item.file.originalName);
});

export const getCapturedLeads = asyncHandler(async (req, res) => {
  const { shortcode } = req.params;
  const item = await VaultItem.findOne({ short: shortcode });

  if (!item) {
    throw new NotFoundError("Vault asset not found");
  }

  if (item.userId && req.user?._id && String(item.userId) !== String(req.user._id)) {
    return res.status(403).json({ error: "Access denied" });
  }

  return res.status(200).json({
    short: item.short,
    totalLeads: item.capturedEmails.length,
    leads: item.capturedEmails,
  });
});

export const deleteVaultItem = asyncHandler(async (req, res) => {
  const { shortcode } = req.params;
  const item = await VaultItem.findOne({ short: shortcode });

  if (!item) {
    throw new NotFoundError("Vault asset not found");
  }

  if (item.userId && req.user?._id && String(item.userId) !== String(req.user._id)) {
    return res.status(403).json({ error: "Access denied" });
  }

  await VaultItem.deleteOne({ _id: item._id });

  return res.status(200).json({
    success: true,
    message: "Vault asset removed successfully",
  });
});

export const configureShareAsset = asyncHandler(async (req, res) => {
  const { shortcode } = req.params;
  const { watermarkText, expiresInMinutes, password, requireEmail, recipientEmail, allowDownload } = req.body;

  const item = await VaultItem.findOne({ short: shortcode });
  if (!item) {
    throw new NotFoundError("Vault asset not found");
  }

  if (item.userId && req.user?._id && String(item.userId) !== String(req.user._id)) {
    throw new UnauthorizedError("Unauthorized access to asset");
  }

  let expiresAt = item.expiresAt;
  if (expiresInMinutes !== undefined && expiresInMinutes !== "") {
    if (Number(expiresInMinutes) > 0) {
      expiresAt = new Date(Date.now() + Number(expiresInMinutes) * 60 * 1000);
    } else {
      expiresAt = null;
    }
  }

  const assignedPassword = password !== undefined ? (password ? String(password).trim() : null) : item.password;
  item.password = assignedPassword;
  item.isPasswordProtected = Boolean(assignedPassword && assignedPassword.length > 0);
  item.expiresAt = expiresAt;
  if (requireEmail !== undefined) {
    item.requireEmail = requireEmail === "true" || requireEmail === true;
  }
  if (allowDownload !== undefined) {
    item.allowDownload = allowDownload === "true" || allowDownload === true;
  }
  if (watermarkText !== undefined && watermarkText.trim()) {
    item.watermarkText = watermarkText.trim();
  }
  item.isShared = true;
  if (recipientEmail) {
    item.recipientEmail = recipientEmail.trim();
  }

  const rawBase = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
  const baseUrl = rawBase.replace(/\/+$/, "");
  const shortUrl = `${baseUrl}/${item.short}`;

  let mailResult = null;
  if (recipientEmail && recipientEmail.trim()) {
    mailResult = await sendVaultShareEmail({
      recipientEmail: recipientEmail.trim(),
      shortUrl,
      password: assignedPassword,
      fileName: item.file?.originalName || null,
      expiresAt,
      senderEmail: req.user?.email || null,
    });
    item.deliveredViaEmail = Boolean(mailResult.success);
  }

  await item.save();

  return res.status(200).json({
    success: true,
    isShared: true,
    shortUrl,
    short: item.short,
    password: assignedPassword,
    isPasswordProtected: item.isPasswordProtected,
    expiresAt,
    deliveredViaEmail: item.deliveredViaEmail,
    recipientEmail: item.recipientEmail,
    previewUrl: mailResult?.previewUrl || null,
    emailError: mailResult?.error || null,
  });
});

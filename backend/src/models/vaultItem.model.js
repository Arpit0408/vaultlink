import mongoose from "mongoose";

const vaultItemSchema = new mongoose.Schema(
  {
    full: {
      type: String,
      default: "",
    },
    short: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["url", "file"],
      default: "url",
    },
    file: {
      originalName: { type: String, default: null },
      mimeType: { type: String, default: null },
      size: { type: Number, default: 0 },
      path: { type: String, default: null },
      watermarkedPath: { type: String, default: null },
      cloudUrl: { type: String, default: null },
      cloudFileId: { type: String, default: null },
    },
    watermarkText: {
      type: String,
      default: null,
    },
    isWatermarked: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: null,
    },
    isPasswordProtected: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    requireEmail: {
      type: Boolean,
      default: false,
    },
    capturedEmails: [
      {
        email: { type: String, required: true },
        accessedAt: { type: Date, default: Date.now },
      },
    ],
    recipientEmail: {
      type: String,
      default: null,
    },
    deliveredViaEmail: {
      type: Boolean,
      default: false,
    },
    isShared: {
      type: Boolean,
      default: true,
    },
    allowDownload: {
      type: Boolean,
      default: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const VaultItem = mongoose.model("shortUrl", vaultItemSchema);
export default VaultItem;
export const urlSchema = VaultItem;

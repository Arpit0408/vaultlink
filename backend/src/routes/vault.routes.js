import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getUserUrls } from "../controllers/url.controller.js";
import {
  createVaultItem,
  getVaultItemInfo,
  accessVaultItem,
  downloadVaultFile,
  getCapturedLeads,
  deleteVaultItem,
  configureShareAsset,
} from "../controllers/vault.controller.js";

const router = express.Router();

router.get("/assets", requireAuth, getUserUrls);

router.post("/share", upload.single("file"), createVaultItem);
router.post("/:shortcode/configure-share", configureShareAsset);
router.get("/:shortcode", getVaultItemInfo);
router.post("/:shortcode/access", accessVaultItem);
router.get("/:shortcode/download", downloadVaultFile);
router.get("/:shortcode/leads", getCapturedLeads);
router.delete("/:shortcode", deleteVaultItem);

export default router;

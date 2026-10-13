import fs from "fs";
import { getImageKitClient } from "../config/imagekit.config.js";

export const uploadToImageKit = async (filePath, fileName, folder = "/vaultlink") => {
  const imagekit = getImageKitClient();
  if (!imagekit) return null;

  try {
    const fileBuffer = fs.readFileSync(filePath);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName || `vault-${Date.now()}`,
      folder,
      useUniqueFileName: true,
    });

    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
      size: response.size,
      filePath: response.filePath,
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
};

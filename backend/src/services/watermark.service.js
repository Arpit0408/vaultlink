import sharp from "sharp";
import path from "path";
import fs from "fs";

export const applyWatermarkToImage = async (inputPath, watermarkText = "VaultLink Protected") => {
  try {
    const filename = path.basename(inputPath);
    const outputDir = path.resolve("uploads/watermarked");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, `wm-${filename}`);

    const metadata = await sharp(inputPath).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;

    const safeText = watermarkText.replace(/[<>&'"]/g, "");
    const fontSize = Math.max(18, Math.round(width / 25));

    const svgOverlay = Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .watermark-text {
            fill: rgba(255, 255, 255, 0.45);
            font-size: ${fontSize}px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
            letter-spacing: 2px;
          }
          .watermark-shadow {
            fill: rgba(0, 0, 0, 0.35);
            font-size: ${fontSize}px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
            letter-spacing: 2px;
          }
        </style>
        <g transform="rotate(-30 ${width / 2} ${height / 2})">
          <text x="${width / 2 + 2}" y="${height / 2 + 2}" text-anchor="middle" class="watermark-shadow">${safeText}</text>
          <text x="${width / 2}" y="${height / 2}" text-anchor="middle" class="watermark-text">${safeText}</text>
          <text x="${width / 4}" y="${height / 4}" text-anchor="middle" class="watermark-text">${safeText}</text>
          <text x="${(width * 3) / 4}" y="${(height * 3) / 4}" text-anchor="middle" class="watermark-text">${safeText}</text>
        </g>
      </svg>
    `);

    await sharp(inputPath)
      .composite([{ input: svgOverlay, top: 0, left: 0 }])
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error("Watermark generation error:", error.message);
    return inputPath;
  }
};

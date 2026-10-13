import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const isGmail =
      !process.env.SMTP_HOST ||
      process.env.SMTP_HOST === "smtp.gmail.com" ||
      process.env.SMTP_USER.includes("@gmail.com");

    const transportConfig = isGmail
      ? {
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }
      : {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        };

    transporter = nodemailer.createTransport(transportConfig);
  } else {
    console.warn("\n[Nodemailer Notice] Real SMTP credentials (SMTP_USER & SMTP_PASS) not configured in backend/.env.");
    console.warn("[Nodemailer Notice] Using temporary Ethereal test mailbox. Emails will NOT reach real personal inboxes until SMTP_USER and SMTP_PASS are set in backend/.env.\n");

    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return transporter;
};

export const sendVaultShareEmail = async ({
  recipientEmail,
  shortUrl,
  password,
  fileName,
  expiresAt,
  senderEmail,
}) => {
  try {
    const mailer = await getTransporter();

    const formattedExpiry = expiresAt
      ? new Date(expiresAt).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC"
      : "Never";

    const senderAddress =
      process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@vaultlink.internal";

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 700;">VaultLink Secure Asset</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">A protected asset has been shared with you${
            senderEmail ? ` by <b>${senderEmail}</b>` : ""
          }.</p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
          ${fileName ? `<p style="margin: 0 0 10px 0; color: #334155; font-size: 14px;"><b>File:</b> ${fileName}</p>` : ""}
          <p style="margin: 0 0 10px 0; color: #334155; font-size: 14px;"><b>Access Link:</b> <a href="${shortUrl}" style="color: #2563eb; text-decoration: underline;">${shortUrl}</a></p>
          ${
            password
              ? `<p style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px;"><b>Passcode:</b> <span style="background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 15px; font-weight: bold;">${password}</span></p>`
              : `<p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;"><b>Passcode:</b> None (Direct Access)</p>`
          }
          <p style="margin: 0; color: #64748b; font-size: 13px;"><b>Expires At:</b> ${formattedExpiry}</p>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${shortUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">Open in VaultLink</a>
        </div>
      </div>
    `;

    const info = await mailer.sendMail({
      from: `"VaultLink" <${senderAddress}>`,
      to: recipientEmail,
      subject: `VaultLink: Secure access to ${fileName || "shared asset"}`,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`\n📬 [TEST EMAIL GENERATED - Ethereal Preview URL]:\n${previewUrl}\n`);
    } else {
      console.log(`\n✉️ [REAL EMAIL DISPATCHED] to ${recipientEmail} (ID: ${info.messageId})\n`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
      isTestAccount: Boolean(previewUrl),
    };
  } catch (error) {
    console.error("Email dispatch failed:", error.message);
    return { success: false, error: error.message };
  }
};

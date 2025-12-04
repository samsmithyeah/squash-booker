import * as fs from "fs";
import * as path from "path";
import { config } from "./config.js";

async function sendTelegramMessage(message: string): Promise<void> {
  if (!config.telegram.botToken || !config.telegram.chatId) {
    console.warn("Telegram credentials not configured. Skipping notification.");
    return;
  }

  const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: config.telegram.chatId,
      text: message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  console.log("Telegram message sent successfully");
}

async function sendTelegramPhoto(
  photoPath: string,
  caption: string
): Promise<void> {
  if (!config.telegram.botToken || !config.telegram.chatId) {
    console.warn("Telegram credentials not configured. Skipping notification.");
    return;
  }

  const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendPhoto`;

  const formData = new FormData();
  formData.append("chat_id", config.telegram.chatId);
  formData.append("caption", caption);

  const photoBuffer = await fs.promises.readFile(photoPath);
  const photoBlob = new Blob([photoBuffer], { type: "image/png" });
  formData.append("photo", photoBlob, path.basename(photoPath));

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  console.log("Telegram photo sent successfully");
}

async function sendTelegramDocument(
  documentPath: string,
  caption: string
): Promise<void> {
  if (!config.telegram.botToken || !config.telegram.chatId) {
    console.warn("Telegram credentials not configured. Skipping notification.");
    return;
  }

  const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendDocument`;

  const formData = new FormData();
  formData.append("chat_id", config.telegram.chatId);
  formData.append("caption", caption);

  const documentBuffer = await fs.promises.readFile(documentPath);
  const documentBlob = new Blob([documentBuffer], { type: "application/pdf" });
  formData.append("document", documentBlob, path.basename(documentPath));

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  console.log("Telegram document sent successfully");
}

export async function notifyBookingSuccess(
  slots: string[],
  receiptPath?: string
): Promise<void> {
  const message = `Booked ${slots.length} time slot${slots.length !== 1 ? "s" : ""}:\n${slots.map((slot) => `${slot}`).join("\n")}\n\nCheckout completed successfully!`;

  if (receiptPath) {
    try {
      await fs.promises.access(receiptPath);
      await sendTelegramDocument(receiptPath, message);
    } catch {
      console.warn(`Receipt not found at ${receiptPath}, sending text only.`);
      await sendTelegramMessage(message);
    }
  } else {
    await sendTelegramMessage(message);
  }
}

export async function notifyBookingFailure(
  error: Error,
  attempt: number,
  maxRetries: number,
  screenshotPath?: string
): Promise<void> {
  const message = `Squash Court Booking Failed\n\nAttempt: ${attempt}/${maxRetries}\n\nError: ${error.message}\n\n${attempt >= maxRetries ? "All retry attempts exhausted." : "Retrying..."}`;

  if (screenshotPath) {
    try {
      await fs.promises.access(screenshotPath);
      await sendTelegramPhoto(screenshotPath, message);
    } catch {
      console.warn(
        `Screenshot not found at ${screenshotPath}, sending text only.`
      );
      await sendTelegramMessage(message);
    }
  } else {
    await sendTelegramMessage(message);
  }
}

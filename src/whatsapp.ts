import twilio from "twilio";
import { config } from "./config.js";

// Get Twilio client - initialized lazily to ensure we use the right credentials
function getTwilioClient() {
  // Prefer Auth Token over API Key for simplicity
  if (config.twilio.authToken) {
    return twilio(config.twilio.accountSid, config.twilio.authToken);
  } else if (config.twilio.apiKeySid && config.twilio.apiKeySecret) {
    return twilio(config.twilio.apiKeySid, config.twilio.apiKeySecret, {
      accountSid: config.twilio.accountSid,
    });
  } else {
    throw new Error("No valid Twilio credentials found");
  }
}

export async function sendWhatsAppMessage(message: string): Promise<void> {
  const hasApiKey = config.twilio.apiKeySid && config.twilio.apiKeySecret;
  const hasAuthToken = config.twilio.authToken;

  if (!config.twilio.accountSid || (!hasApiKey && !hasAuthToken)) {
    console.warn("⚠️  Twilio credentials not configured. Skipping WhatsApp notification.");
    return;
  }

  try {
    const client = getTwilioClient();
    const result = await client.messages.create({
      body: message,
      from: config.twilio.whatsappFrom,
      to: config.twilio.whatsappTo,
    });

    console.log(`✅ WhatsApp message sent: ${result.sid}`);
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error);
    throw error;
  }
}

export async function notifyBookingSuccess(slots: string[]): Promise<void> {
  const message = `✅ Squash Court Booking Success!\n\nBooked ${slots.length} time slot(s):\n${slots.map((slot, i) => `${i + 1}. ${slot}`).join('\n')}\n\nCheckout completed successfully!`;

  await sendWhatsAppMessage(message);
}

export async function notifyBookingFailure(error: Error, attempt: number, maxRetries: number): Promise<void> {
  const message = `❌ Squash Court Booking Failed\n\nAttempt: ${attempt}/${maxRetries}\n\nError: ${error.message}\n\n${attempt >= maxRetries ? 'All retry attempts exhausted.' : 'Retrying...'}`;

  await sendWhatsAppMessage(message);
}

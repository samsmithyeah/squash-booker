import twilio from "twilio";
import { config } from "./config.js";

/**
 * This script helps you find your WhatsApp group ID.
 *
 * Steps:
 * 1. Send a message from your WhatsApp group to your Twilio number
 * 2. Run this script to see recent incoming messages
 * 3. Look for the group message - the "from" field will contain the group ID
 */

async function getRecentMessages() {
  console.log("=== Fetching Recent WhatsApp Messages ===\n");

  try {
    // Initialize Twilio client
    const client = config.twilio.authToken
      ? twilio(config.twilio.accountSid, config.twilio.authToken)
      : twilio(config.twilio.apiKeySid!, config.twilio.apiKeySecret!, {
          accountSid: config.twilio.accountSid,
        });

    // Fetch recent incoming messages
    const messages = await client.messages.list({
      to: config.twilio.whatsappFrom,
      limit: 20,
    });

    if (messages.length === 0) {
      console.log("No messages found.");
      console.log("\nTo get your group ID:");
      console.log("1. Send a message from your WhatsApp group to:", config.twilio.whatsappFrom);
      console.log("2. Run this script again");
      return;
    }

    console.log(`Found ${messages.length} recent message(s):\n`);

    messages.forEach((message, index) => {
      console.log(`--- Message ${index + 1} ---`);
      console.log(`From: ${message.from}`);
      console.log(`Date: ${message.dateSent}`);
      console.log(`Body: ${message.body?.substring(0, 50)}${message.body && message.body.length > 50 ? '...' : ''}`);
      console.log(`Status: ${message.status}`);

      // Check if this looks like a group message
      if (message.from && message.from.includes('_')) {
        console.log(`\n🎯 This looks like a GROUP message!`);
        console.log(`   Group ID format: ${message.from}`);
        console.log(`\n   Add this to your .env file:`);
        console.log(`   TWILIO_WHATSAPP_TO=${message.from}`);
      }

      console.log('');
    });

    console.log("\n📝 Instructions:");
    console.log("- Individual numbers look like: whatsapp:+447813917755");
    console.log("- Group IDs look like: whatsapp:+14155238886_[GROUP_ID]");
    console.log("- Copy the 'From' field of your group message and set it as TWILIO_WHATSAPP_TO in .env");

  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    process.exit(1);
  }
}

getRecentMessages();

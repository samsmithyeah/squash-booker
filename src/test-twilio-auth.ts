import { config } from "./config.js";

console.log("=== Twilio Configuration Debug ===\n");

console.log("Account SID:", config.twilio.accountSid);
console.log("Account SID starts with 'AC':", config.twilio.accountSid.startsWith('AC'));
console.log("Account SID length:", config.twilio.accountSid.length);

console.log("\nAPI Key SID:", config.twilio.apiKeySid);
console.log("API Key SID starts with 'SK':", config.twilio.apiKeySid?.startsWith('SK'));
console.log("API Key SID length:", config.twilio.apiKeySid?.length);

console.log("\nAPI Key Secret length:", config.twilio.apiKeySecret?.length);
console.log("API Key Secret (first 5 chars):", config.twilio.apiKeySecret?.substring(0, 5));

console.log("\nWhatsApp From:", config.twilio.whatsappFrom);
console.log("WhatsApp To:", config.twilio.whatsappTo);

console.log("\nAuth Token length:", config.twilio.authToken?.length);
console.log("Auth Token (first 5 chars):", config.twilio.authToken?.substring(0, 5));

console.log("\n=== Testing Twilio with Auth Token ===\n");

// Try with regular auth token instead
import twilio from "twilio";

async function testWithAuthToken() {
  try {
    console.log("Creating client with Account SID + Auth Token...");

    // You need to get your Auth Token from https://console.twilio.com/
    // It's different from the API Key Secret
    console.log("\n⚠️  Note: You're using an API Key, but you might also need the main Auth Token");
    console.log("Find your Auth Token at: https://console.twilio.com/");
    console.log("It will be shown next to your Account SID on the dashboard");

  } catch (error) {
    console.error("Error:", error);
  }
}

testWithAuthToken();

import {
  sendWhatsAppMessage,
  notifyBookingSuccess,
  notifyBookingFailure,
} from "./whatsapp.js";

async function testWhatsApp() {
  console.log("=== Testing WhatsApp Notifications ===\n");

  try {
    // Test 1: Simple message
    console.log("1. Testing simple message...");
    await sendWhatsAppMessage("🧪 Test message from squash-booker app!");
    console.log("✅ Simple message sent\n");

    // Wait a bit between messages
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 2: Success notification
    console.log("2. Testing booking success notification...");
    const testSlots = [
      "Mon 19:40 - 20:20 - Squash Court 1",
      "Mon 20:20 - 21:00 - Squash Court 2",
    ];
    await notifyBookingSuccess(testSlots);
    console.log("✅ Success notification sent\n");

    // Wait a bit between messages
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 3: Failure notification
    console.log("3. Testing booking failure notification...");
    const testError = new Error("Test error: Could not find available court");
    await notifyBookingFailure(testError, 1, 3);
    console.log("✅ Failure notification sent\n");

    console.log("=== All WhatsApp tests completed successfully! ===");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

testWhatsApp();

import { chromium, Browser, BrowserContext, Page } from "playwright";
import * as fs from "fs";
import { config } from "./config.js";
import { LoginPage } from "./pages/LoginPage.js";
import { BookingPage } from "./pages/BookingPage.js";
import { CheckoutPage } from "./pages/CheckoutPage.js";
import { ConfirmationPage } from "./pages/ConfirmationPage.js";
import { BookingsPage } from "./pages/BookingsPage.js";
import { OrderPage } from "./pages/OrderPage.js";
import { notifyBookingSuccess, notifyBookingFailure } from "./telegram.js";

async function bookSquashCourts() {
  const maxRetries = 3;
  let attempt = 0;
  const bookedSlots: string[] = [];

  // Ensure artifacts directory exists for artifacts
  if (!fs.existsSync("artifacts")) {
    fs.mkdirSync("artifacts", { recursive: true });
  }

  while (attempt < maxRetries) {
    attempt++;
    let browser: Browser | null = null;
    let context: BrowserContext | null = null;
    let page: Page | null = null;

    try {
      console.log(`\n=== Attempt ${attempt}/${maxRetries} ===\n`);

      // Launch browser
      console.log("Launching browser...");
      browser = await chromium.launch({
        headless: config.headless,
      });

      context = await browser.newContext({
        recordVideo: { dir: "artifacts" },
      });
      await context.tracing.start({ screenshots: true, snapshots: true });
      page = await context.newPage();
      page.setDefaultTimeout(30000);

      // Initialize page objects
      const loginPage = new LoginPage(page);
      const bookingPage = new BookingPage(page);
      const checkoutPage = new CheckoutPage(page);
      const confirmationPage = new ConfirmationPage(page);
      const bookingsPage = new BookingsPage(page);
      const orderPage = new OrderPage(page);

      console.log("Starting squash court booking...");

      // Navigate to booking page
      console.log("Navigating to booking page...");
      await page.goto(config.bookingUrl);
      await loginPage.acceptCookies();

      // Login
      await loginPage.login(config.username, config.password);

      // Clear basket
      await bookingPage.removeAllItemsFromBasket();

      // Start booking process
      console.log(
        `Booking ${config.timeSlots.length} time slots for next Monday`
      );

      // Book each time slot
      for (let i = 0; i < config.timeSlots.length; i++) {
        const slot = config.timeSlots[i];

        console.log(
          `\n[${i + 1}/${config.timeSlots.length}] Booking: ${slot.day} ${
            slot.time
          }`
        );

        // Navigate to squash court booking

        // Select the day (next Monday)
        console.log(`  → Selecting ${slot.day}...`);
        await bookingPage.gotoDate(slot.day);

        // Select time slot
        console.log(`  → Selecting time slot ${slot.time}...`);
        await bookingPage.selectTimeSlot(slot.time);

        // Select court (any available from accepted courts)
        console.log(
          `  → Selecting court from: ${config.acceptedCourts.join(", ")}...`
        );
        const selectedCourt = await bookingPage.selectCourt(
          config.acceptedCourts
        );

        // Add to basket instead of booking immediately
        console.log("  → Adding to basket...");
        await bookingPage.addToBasket();

        console.log(`✅ Successfully added to basket: ${selectedCourt}`);

        // Track booked slots
        bookedSlots.push(`${slot.day} ${slot.time} - ${selectedCourt}`);

        // Small delay between bookings
        await page.waitForTimeout(2000);
      }

      // Complete checkout
      console.log("\n=== Completing checkout ===");

      // Go to checkout
      await bookingPage.checkoutButton.click();

      // Complete checkout
      // Wait for page URL to include "checkout"
      await page.waitForURL(/.*checkout.*/);
      await checkoutPage.checkoutHeading.waitFor({ state: "visible" });

      // Use credit if available
      if (await checkoutPage.useCreditButton.isVisible()) {
        console.log("Using available credit for payment...");
        await checkoutPage.useCreditButton.click();
        await checkoutPage.confirmBookingButton.click();
      } else {
        console.log("No credit available, proceeding with saved card...");
        await checkoutPage.selectSavedCard();
        await checkoutPage.acceptTerms();
        await checkoutPage.cvvInput.fill(config.cvv);
        await checkoutPage.payNowButton.click();
      }

      // Wait for confirmation
      await confirmationPage.confirmationText.waitFor({ state: "visible" });
      console.log("\n✅ All bookings completed and checkout finished!");

      // Navigate to bookings to download receipt
      console.log("\n=== Downloading receipt ===");
      console.log("Navigating to My Bookings...");
      await confirmationPage.viewMyBookingsButton.click();

      // Wait for bookings page to load
      await page.waitForURL(/.*bookings.*/);
      await bookingsPage.viewBookingButton
        .first()
        .waitFor({ state: "visible" });

      // Click View booking on the first booking
      console.log("Opening booking details...");
      await bookingsPage.viewBookingButton.first().click();

      // Wait for modal and click View order
      console.log("Opening order details...");
      await bookingsPage.viewOrderButton.waitFor({ state: "visible" });
      await bookingsPage.viewOrderButton.click();

      // Wait for order page to load
      await page.waitForURL(/.*order-history.*/);
      await orderPage.downloadReceiptButton.waitFor({ state: "visible" });

      // Download receipt
      const receiptPath = "artifacts/receipt.pdf";
      console.log("Downloading receipt...");
      await orderPage.downloadReceipt(receiptPath);

      // Send success notification with receipt
      await notifyBookingSuccess(bookedSlots, receiptPath);

      // Success - break out of retry loop
      break;
    } catch (error) {
      console.error(`\n❌ Error occurred during booking attempt ${attempt}:`);
      console.error(error);

      // Save artifacts on failure
      const failureScreenshotPath = `artifacts/failure-attempt-${attempt}.png`;
      if (page) {
        await page.screenshot({
          path: failureScreenshotPath,
        });
      }
      if (context) {
        await context.tracing.stop({
          path: `artifacts/trace-attempt-${attempt}.zip`,
        });
      }

      if (attempt >= maxRetries) {
        // Send failure notification only after all retries are exhausted
        const err = error instanceof Error ? error : new Error(String(error));
        await notifyBookingFailure(
          err,
          attempt,
          maxRetries,
          failureScreenshotPath
        );
        console.error(`\n❌ Failed after ${maxRetries} attempts. Giving up.`);
        process.exit(1);
      } else {
        console.log(`\n⏳ Retrying in 5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } finally {
      // Cleanup
      if (page) {
        await page.close();
      }
      if (browser) {
        await browser.close();
      }
    }
  }
}

// Run the booking script
bookSquashCourts();

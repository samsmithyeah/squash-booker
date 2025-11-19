import { chromium, Browser, Page } from "playwright";
import { config } from "./config.js";
import { LoginPage } from "./pages/LoginPage.js";
import { BookingPage } from "./pages/BookingPage.js";
import { CheckoutPage } from "./pages/CheckoutPage.js";
import { ConfirmationPage } from "./pages/ConfirmationPage.js";

async function bookSquashCourts() {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
      console.log(`\n=== Attempt ${attempt}/${maxRetries} ===\n`);

      // Launch browser
      console.log("Launching browser...");
      browser = await chromium.launch({
        headless: config.headless,
      });

      const context = await browser.newContext();
      page = await context.newPage();

      // Initialize page objects
      const loginPage = new LoginPage(page);
      const bookingPage = new BookingPage(page);
      const checkoutPage = new CheckoutPage(page);
      const confirmationPage = new ConfirmationPage(page);

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

        // Small delay between bookings
        await page.waitForTimeout(2000);
      }

      // Complete checkout
      console.log("\n=== Completing checkout ===");

      // Go to checkout
      await bookingPage.checkoutButton.click();

      // Complete checkout
      await checkoutPage.selectSavedCard();
      await checkoutPage.acceptTerms();
      await checkoutPage.cvvInput.fill(config.cvv);
      await checkoutPage.payNowButton.click();

      // Wait for confirmation
      await confirmationPage.confirmationText.waitFor({ state: "visible" });

      console.log("\n✅ All bookings completed and checkout finished!");

      // Success - break out of retry loop
      break;
    } catch (error) {
      console.error(`\n❌ Error occurred during booking attempt ${attempt}:`);
      console.error(error);

      if (attempt >= maxRetries) {
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

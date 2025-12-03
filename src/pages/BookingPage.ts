import { BasePage } from "./BasePage.js";

export class BookingPage extends BasePage {
  // Element locators
  private readonly courtDropdownControl = this.page
    .locator('[class*="control"]')
    .first();
  private readonly courtDropdownMenu = this.page
    .locator('[class*="menu"]')
    .first();
  private readonly bookNowButton = this.page.getByRole("button", {
    name: /book now/i,
  });
  private readonly addToBasketButton = this.page.getByRole("button", {
    name: /add to basket/i,
  });
  readonly checkoutButton = this.page.getByRole("link", {
    name: /checkout now/i,
  });
  readonly removeItemButton = this.page.getByRole("button", {
    name: /remove from cart/i,
  });

  async removeAllItemsFromBasket() {
    await this.page.getByText("Shopping basket").first().waitFor();
    while (await this.removeItemButton.first().isVisible()) {
      console.log("Removing item from basket...");
      await this.removeItemButton.first().click();
      // Wait a moment for the item to be removed
      await this.page.waitForTimeout(2000);
    }
    await this.page.getByText("£0.00").first().waitFor();
    console.log("Basket is now empty.");
  }

  async gotoDate(dayOfWeek: string) {
    // Calculate next occurrence of the desired day
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const targetDayIndex = daysOfWeek.indexOf(dayOfWeek);

    if (targetDayIndex === -1) {
      throw new Error(`Invalid day of week: ${dayOfWeek}`);
    }

    const today = new Date();
    const currentDayIndex = today.getDay();

    // Calculate days until next occurrence of target day
    let daysUntilTarget = targetDayIndex - currentDayIndex;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // Next week
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);

    // Format as YYYY-MM-DD
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    // Construct URL with the calculated date and navigate to it
    const baseDatePageUrl = `https://bookings.better.org.uk/location/walthamstow-leisure-centre/squash-court-40min/${dateString}/by-time`;
    console.log(`  → Navigating to ${dateString}...`);
    await this.page.goto(baseDatePageUrl);
  }

  async selectTimeSlot(time: string) {
    const timeCard = this.page
      .getByText(time)
      .first()
      .locator("..")
      .locator("..");
    await timeCard.waitFor({ state: "visible" });
    const bookButton = timeCard.getByRole("link", {
      name: /squash court 40min from/i,
    });
    await bookButton.waitFor({ state: "visible" });
    await bookButton.click();
  }

  async selectCourt(acceptedCourts: string[]) {
    // Click the control div to open the dropdown
    await this.courtDropdownControl.waitFor();
    await this.courtDropdownControl.click({ force: true });

    // Get all options from the menu
    await this.courtDropdownMenu.waitFor({ state: "visible" });

    const options = await this.courtDropdownMenu
      .locator('[class*="option"]')
      .allTextContents();

    // Find first acceptable court that's available
    for (const acceptedCourt of acceptedCourts) {
      const matchingOption = options.find((option) =>
        option.includes(acceptedCourt)
      );
      if (matchingOption) {
        console.log(`Selecting court: ${acceptedCourt}`);
        await this.courtDropdownMenu
          .locator('[class*="option"]', { hasText: acceptedCourt })
          .click();
        return acceptedCourt;
      }
    }

    throw new Error(
      `None of the accepted courts available: ${acceptedCourts.join(", ")}`
    );
  }

  async bookNow() {
    await this.bookNowButton.click();
  }

  async addToBasket() {
    await this.addToBasketButton.click();
  }
}

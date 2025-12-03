import { BasePage } from "./BasePage.js";
import { expect } from "playwright/test";

export class CheckoutPage extends BasePage {
  // Element locators
  private readonly savedCardRadio = this.page.getByRole("radio", {
    name: /pay with saved card/i,
  });
  private readonly termsCheckbox = this.page.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  readonly payNowButton = this.page.getByRole("button", { name: /pay.*now/i });
  readonly cvvInput = this.page.getByLabel("Security Code (CVV)");
  readonly useCreditButton = this.page.getByRole("button", {
    name: /pay full amount using credit/i,
  });
  // Note: Button has aria-label="Pay now" but visible text is "Confirm booking"
  readonly confirmBookingButton = this.page.getByRole("button", {
    name: "Pay now",
  });
  readonly checkoutHeading = this.page.getByRole("heading", {
    name: /checkout/i,
  });

  async selectSavedCard() {
    await this.savedCardRadio.waitFor({ state: "visible" });
    await this.savedCardRadio.check();
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }
}

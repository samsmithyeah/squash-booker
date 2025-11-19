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

  async selectSavedCard() {
    await expect(this.savedCardRadio).toBeVisible();
    await this.savedCardRadio.check();
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }
}

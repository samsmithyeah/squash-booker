import { BasePage } from "./BasePage.js";

export class ConfirmationPage extends BasePage {
  // Element locators
  readonly confirmationText = this.page.getByText(/checkout successful/i);
}

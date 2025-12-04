import { BasePage } from "./BasePage.js";

export class ConfirmationPage extends BasePage {
  readonly confirmationText = this.page.getByText(/checkout successful/i);
  readonly viewMyBookingsButton = this.page.getByRole("link", {
    name: "View my bookings",
  });
}

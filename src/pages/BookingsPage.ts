import { BasePage } from "./BasePage.js";

export class BookingsPage extends BasePage {
  readonly viewBookingButton = this.page.getByTestId("button").filter({
    hasText: "View booking",
  });

  readonly viewOrderButton = this.page.getByRole("link", {
    name: "View order details",
  });
}

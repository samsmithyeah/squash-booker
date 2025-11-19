import { Page } from "playwright";

export class BasePage {
  constructor(protected page: Page) {}

  async acceptCookies() {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const acceptButton = this.page.getByRole("button", {
          name: /accept all cookies/i,
        });
        await acceptButton.click();

        // Wait for cookie banner to disappear
        await this.page.waitForTimeout(1000);
        console.log("Cookies accepted");
        return; // Success, exit
      } catch (error) {
        if (attempt === maxRetries) {
          console.log("Cookies banner not found or already accepted");
        } else {
          console.log(
            `Cookie acceptance attempt ${attempt} failed, retrying...`
          );
          await this.page.waitForTimeout(1000);
        }
      }
    }
  }
}

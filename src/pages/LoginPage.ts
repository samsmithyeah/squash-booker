import { BasePage } from "./BasePage.js";

export class LoginPage extends BasePage {
  private readonly emailInput = this.page.getByRole("textbox", {
    name: /email/i,
  });
  private readonly passwordInput = this.page.getByRole("textbox", {
    name: /password/i,
  });
  private readonly loginHeaderButton = this.page.getByTestId("login");
  private readonly loginModalButton = this.page.getByTestId("log-in");
  private readonly myAccountLink = this.page.getByRole("link", {
    name: /my account/i,
  });

  async login(email: string, password: string) {
    console.log("Logging in...");
    await this.loginHeaderButton.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginModalButton.click();
    await this.myAccountLink.waitFor();
    console.log("✅ Logged in successfully\n");
  }
}

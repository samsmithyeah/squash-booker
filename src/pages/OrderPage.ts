import { BasePage } from "./BasePage.js";

export class OrderPage extends BasePage {
  // Element locators
  readonly downloadReceiptButton = this.page.getByRole("button", {
    name: "Download receipt",
  });

  async downloadReceipt(downloadPath: string): Promise<string> {
    const downloadPromise = this.page.waitForEvent("download");
    await this.downloadReceiptButton.click();
    const download = await downloadPromise;

    // Save to specified path
    await download.saveAs(downloadPath);
    console.log(`Receipt downloaded to: ${downloadPath}`);

    return downloadPath;
  }
}

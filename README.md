# Squash Court Booker

Automated squash court booking for Better UK facilities using Playwright.

## How it works

- Uses Playwright to automate the booking flow (login, select slots, checkout)
- Runs on a schedule via GitHub Actions (Tuesday evenings to book for the following week)
- Can also be triggered manually with custom day/time inputs
- Sends Telegram notifications on success or failure

## Setup

1. Install dependencies: `npm install`
2. Create `.env` with your credentials:
   ```
   BOOKING_URL=https://bookings.better.org.uk/location/...
   USERNAME=your-email
   PASSWORD=your-password
   CVV=your-cvv
   TELEGRAM_BOT_TOKEN=optional
   TELEGRAM_CHAT_ID=optional
   ```
3. Run: `npm run book`

## GitHub Actions

The workflow can be triggered manually via `workflow_dispatch` to select specific days and time slots, or runs automatically on a schedule.

# Squash Court Booker

Automated squash court booking system for Better UK facilities using Playwright. Books multiple time slots weekly via GitHub Actions.

## Features

- Automated login and multiple court bookings
- Books **two Monday slots every week**:
  - Monday 7:40 PM (19:40 - 20:20)
  - Monday 8:20 PM (20:20 - 21:00)
- Accepts either Court 1 or Court 2 (whichever is available)
- Runs automatically every Tuesday at 10:01 PM UK time
- Page Object Model architecture
- TypeScript with modern ES2023 syntax
- Comprehensive booking summary and error handling
- Screenshot capture for verification

## Setup

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure your credentials in `.env`:

```env
BOOKING_URL=https://bookings.better.org.uk/location/walthamstow-leisure-centre/squash-activities
USERNAME=your-email@example.com
PASSWORD=your-password
CVV=your-cvv
HEADLESS=false
```

**Note:** Time slots are hardcoded in `src/config.ts` to book Monday 7:40 PM and 8:20 PM slots automatically.

3. Run the booking script:

```bash
npm run book
```

## Configuration

### Environment Variables

| Variable      | Description                               | Required            |
| ------------- | ----------------------------------------- | ------------------- |
| `BOOKING_URL` | Better UK booking page URL                | Yes                 |
| `USERNAME`    | Your Better UK account email              | Yes                 |
| `PASSWORD`    | Your Better UK account password           | Yes                 |
| `CVV`         | Your card CVV                             | Yes                 |
| `HEADLESS`    | Run browser in headless mode (true/false) | No (default: false) |

### Booking Configuration

Time slots and court preferences are configured in `src/config.ts`:

```typescript
timeSlots: [
  {
    day: 'Mon',
    time: '19:40 - 20:20', // 7:40 PM
  },
  {
    day: 'Mon',
    time: '20:20 - 21:00', // 8:20 PM
  },
],
acceptedCourts: ['Squash Court 1', 'Squash Court 2'],
```

To modify booking times or add additional slots, edit this file.

### Scheduling

The GitHub Actions workflow runs every **Tuesday at 10:01 PM UK time** to book courts for the following Monday.

The workflow is configured in `.github/workflows/book-squash.yml` with dual cron schedules to handle UK timezone changes:

```yaml
schedule:
  # GMT (winter): 22:01 UTC
  - cron: "1 22 * * 2"
  # BST (summer): 21:01 UTC
  - cron: "1 21 * * 2"
```

## Usage

### Manual Booking

```bash
npm run book
```

## License

ISC

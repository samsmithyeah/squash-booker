import "dotenv/config";

export interface TimeSlot {
  day: string; // e.g., "Mon 24"
  time: string; // e.g., "19:40 - 20:20"
}

export interface BookingConfig {
  bookingUrl: string;
  username: string;
  password: string;
  timeSlots: TimeSlot[];
  acceptedCourts: string[]; // e.g., ["Squash Court 1", "Squash Court 2"]
  headless: boolean;
  cvv: string;
}

export const config: BookingConfig = {
  bookingUrl: process.env.BOOKING_URL || "",
  username: process.env.USERNAME || "",
  password: process.env.PASSWORD || "",
  timeSlots: [
    {
      day: "Mon",
      time: "19:40 - 20:20",
    },
    {
      day: "Mon",
      time: "20:20 - 21:00",
    },
  ],
  acceptedCourts: ["Squash Court 1", "Squash Court 2"],
  headless: process.env.HEADLESS === "true" || false,
  cvv: process.env.CVV || "",
};

// Validate required config
if (!config.bookingUrl || !config.username || !config.password) {
  throw new Error(
    "Missing required environment variables: BOOKING_URL, USERNAME, PASSWORD"
  );
}

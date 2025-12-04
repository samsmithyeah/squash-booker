import "dotenv/config";

interface TimeSlot {
  day: string; // e.g., "Mon 24"
  time: string; // e.g., "19:40 - 20:20"
}

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

interface BookingConfig {
  bookingUrl: string;
  username: string;
  password: string;
  timeSlots: TimeSlot[];
  acceptedCourts: string[]; // e.g., ["Squash Court 1", "Squash Court 2"]
  headless: boolean;
  cvv: string;
  telegram: TelegramConfig;
}

function formatTimeSlot(startTime: string): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endMinutes = minutes + 40;
  const endHours = hours + Math.floor(endMinutes / 60);
  const endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;
  return `${startTime} - ${endTime}`;
}

function parseTimeSlots(): TimeSlot[] {
  const day = process.env.BOOKING_DAY;
  const time1 = process.env.BOOKING_TIME1;
  const time2 = process.env.BOOKING_TIME2;

  // If no inputs provided, use defaults
  if (!day && !time1) {
    return [
      { day: "Mon", time: "19:40 - 20:20" },
      { day: "Mon", time: "20:20 - 21:00" },
    ];
  }

  const slots: TimeSlot[] = [];
  const bookingDay = day || "Mon";

  if (time1) {
    slots.push({ day: bookingDay, time: formatTimeSlot(time1) });
  }
  if (time2 && time2 !== "none") {
    slots.push({ day: bookingDay, time: formatTimeSlot(time2) });
  }

  return slots;
}

export const config: BookingConfig = {
  bookingUrl: process.env.BOOKING_URL || "",
  username: process.env.USERNAME || "",
  password: process.env.PASSWORD || "",
  timeSlots: parseTimeSlots(),
  acceptedCourts: ["Squash Court 1", "Squash Court 2"],
  headless: process.env.HEADLESS === "true" || false,
  cvv: process.env.CVV || "",
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || "",
    chatId: process.env.TELEGRAM_CHAT_ID || "",
  },
};

// Validate required config
if (!config.bookingUrl || !config.username || !config.password) {
  throw new Error(
    "Missing required environment variables: BOOKING_URL, USERNAME, PASSWORD"
  );
}

# WhatsApp Setup Instructions

## Join the Twilio WhatsApp Sandbox

Before you can receive WhatsApp messages, you need to join the Twilio WhatsApp Sandbox:

1. **Go to the Twilio WhatsApp Sandbox:**
   - Visit: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

2. **Get your sandbox number:**
   - You'll see a WhatsApp number (e.g., +1 415 523 8886)
   - You'll also see a code like "join <word>-<word>"

3. **Join the sandbox from your phone:**
   - Open WhatsApp on your phone (+447813917755)
   - Send a message to the sandbox number
   - The message should be exactly: `join <your-code>`
   - Example: `join coffee-mountain`

4. **Wait for confirmation:**
   - You should receive a confirmation message from Twilio
   - Once confirmed, you're ready to receive messages!

5. **Update your .env file (if needed):**
   - Make sure `TWILIO_WHATSAPP_FROM` matches the sandbox number
   - Format: `whatsapp:+14155238886` (your current: `whatsapp:+15558344152`)

## Testing

Once you've joined the sandbox, run:
```
npm run whatsapp:test
```

You should receive 3 WhatsApp messages:
1. A simple test message
2. A booking success notification
3. A booking failure notification

## Sending to a WhatsApp Group

To send messages to a WhatsApp group instead of an individual number:

1. **Get the Group ID:**
   - You need to use the Twilio API to get the group ID
   - The group admin must first send a message from the group to your Twilio number
   - Then you can retrieve the group ID from Twilio's message logs

2. **Method 1: Using Twilio Console (Easier):**
   - Have someone in the group send a message to your Twilio WhatsApp number
   - Go to: https://console.twilio.com/us1/monitor/logs/sms
   - Find the incoming message from the group
   - Look for the "From" field - it will show something like `whatsapp:+14155238886_[GROUP_ID]`
   - Copy the full value including the group ID

3. **Method 2: Using Code (Advanced):**
   - Set up a webhook to receive incoming messages
   - Have someone send a message from the group
   - The webhook will receive the group ID in the "From" field

4. **Update your .env:**
   ```
   # For individual number:
   TWILIO_WHATSAPP_TO=whatsapp:+447813917755

   # For group (example format):
   TWILIO_WHATSAPP_TO=whatsapp:+14155238886_ABC123XYZ
   ```

5. **Important Group Limitations:**
   - The group must be connected to your Twilio sandbox (someone in the group must have joined)
   - Not all Twilio accounts support group messaging - check your account capabilities
   - Group messaging may require a production WhatsApp Business Account (not available in sandbox)

**Note:** WhatsApp group messaging through Twilio is limited and may not work in the sandbox. You may need to upgrade to a production WhatsApp Business Account for full group messaging support.

## Important Notes

- **Sandbox expiration:** The sandbox connection expires after 72 hours of inactivity. You'll need to send the join message again if it expires.
- **Production setup:** For production, you'll need to apply for WhatsApp Business API approval and get your own WhatsApp number. The sandbox is only for testing.
- **Number format:** Make sure your phone number is in E.164 format: `whatsapp:+[country code][number]`

## Troubleshooting

If you're still not receiving messages after joining:

1. **Check the Twilio console logs:**
   - Go to: https://console.twilio.com/us1/monitor/logs/sms
   - Look for any error messages

2. **Verify your phone number format:**
   - Should be: `whatsapp:+447813917755`
   - No spaces, dashes, or parentheses

3. **Check if you've joined the sandbox:**
   - Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
   - Your number should appear in the "Sandbox Participants" list

4. **Verify the sandbox number:**
   - Make sure `TWILIO_WHATSAPP_FROM` in your `.env` matches the sandbox number shown in the console

# Environment Configuration

Add these variables to your `.env` file in the `back/` directory:

```env
# Form notification email
FORM_NOTIFICATION_EMAIL=kgmmorocco@gmail.com

# KGM Webhook URL for sending leads
# For testing: use your local webhook endpoint (creates a loop for testing)
# Example: http://localhost:8000/api/webhook/kgm
# For production: use KGM's production webhook endpoint
# KGM_WEBHOOK_URL=http://localhost:8000/api/webhook/kgm
KGM_WEBHOOK_URL=https://kgm.preprodagency.com/api/webhook/kgm

# Enable/disable webhook sending
# Set to false to disable webhook sending
# Default: true
KGM_WEBHOOK_ENABLED=true

# Enable/disable email sending from webhook receiver
# If KGM_WEBHOOK_URL points to localhost, emails are automatically disabled to avoid duplicates
# Set to true to force email sending even in local mode
# Set to false to disable emails from webhook (recommended for local testing)
# If not set: auto-detects (false if localhost, true otherwise)
# KGM_WEBHOOK_SEND_EMAIL=false
```

## Testing Configuration

For local testing, you can set `KGM_WEBHOOK_URL` to your local webhook endpoint. This will create a loop:

1. Form submitted → Saved to DB → Email sent → Webhook called
2. Webhook receives → Decrypts → Saves to DB → Email sent

This allows you to test the full encryption/decryption flow locally.

## Production Configuration

For production, update `KGM_WEBHOOK_URL` to KGM's actual webhook endpoint URL.

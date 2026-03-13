# Webhook Testing Guide

## Quick Test Methods

### Method 1: Using Test Endpoint (Easiest)

1. **Check status and instructions:**
   ```bash
   GET http://localhost:8000/api/webhook/test-status
   ```

2. **Test webhook with default data:**
   ```bash
   POST http://localhost:8000/api/webhook/test
   ```

3. **Test webhook with custom data:**
   ```bash
   POST http://localhost:8000/api/webhook/test
   Content-Type: application/json
   
   {
     "model": "TORRES",
     "nom": "Doe",
     "prenom": "John",
     "telephone": "+212 6 12 34 56 78",
     "email": "john@example.com",
     "message": "Test message"
   }
   ```

4. **Force localhost test (bypass loop detection):**
   ```bash
   POST http://localhost:8000/api/webhook/test?force_local=1
   ```

### Method 2: Using Environment Variable

1. **Add to `.env` file:**
   ```env
   KGM_WEBHOOK_FORCE_LOCAL=true
   KGM_WEBHOOK_ENABLED=true
   KGM_WEBHOOK_URL=http://localhost:8000/api/webhook/kgm
   ```

2. **Submit a real test drive form** or use the test endpoint

3. **Check results:**
   - Logs: `storage/logs/laravel.log`
   - Database: `test_drive_submissions` table
   - You should see 2 entries (one from form, one from webhook)

### Method 3: Test Real Form Flow

1. **Set in `.env`:**
   ```env
   KGM_WEBHOOK_FORCE_LOCAL=true
   KGM_WEBHOOK_ENABLED=true
   ```

2. **Submit a test drive form** from the frontend

3. **Check logs and database** for webhook activity

## What to Check

### ✅ Success Indicators

1. **In logs (`storage/logs/laravel.log`):**
   - `KGM Webhook: Test drive lead sent successfully`
   - `Webhook test drive lead processed successfully`
   - `submission_id` numbers

2. **In database:**
   - Check `test_drive_submissions` table
   - Should have entries with matching data

3. **No errors:**
   - No timeout errors
   - No connection errors (unless testing localhost without force_local)

### ❌ Common Issues

1. **"Skipping localhost loop"**
   - **Solution:** Set `KGM_WEBHOOK_FORCE_LOCAL=true` in `.env` or use `?force_local=1`

2. **Timeout errors**
   - **Solution:** Make sure Laravel server is running on port 8000
   - Or set `KGM_WEBHOOK_ENABLED=false` to skip webhook

3. **No logs**
   - **Solution:** Check `storage/logs/laravel.log` file exists and is writable

## Testing Full Flow

To test the complete encryption/decryption flow:

1. Set `KGM_WEBHOOK_FORCE_LOCAL=true` in `.env`
2. Submit a test drive form
3. You should see:
   - Form saved to DB (submission 1)
   - Email sent
   - Webhook called → encrypted → sent
   - Webhook received → decrypted → saved to DB (submission 2)
   - Email sent (if `KGM_WEBHOOK_SEND_EMAIL=true`)

## Production Testing

For production testing, update `.env`:

```env
KGM_WEBHOOK_URL=https://kgm-production-webhook-url.com/api/webhook
KGM_WEBHOOK_ENABLED=true
KGM_WEBHOOK_FORCE_LOCAL=false
```

Then test with the test endpoint or real form submissions.

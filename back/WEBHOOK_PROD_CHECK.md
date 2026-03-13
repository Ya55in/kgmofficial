# How to Check if Webhook is Working in Production

## Quick Checks

### 1. Check Logs (Easiest)

**Location:** `storage/logs/laravel.log`

**Look for these messages:**

✅ **Success:**
```
[timestamp] production.INFO: KGM Webhook: Test drive lead sent successfully
[timestamp] production.INFO: Webhook test drive lead processed successfully {"submission_id":X}
```

❌ **Failure:**
```
[timestamp] production.ERROR: KGM Webhook: Error sending lead
[timestamp] production.WARNING: KGM Webhook: Failed to send test drive lead
```

**Command to check recent webhook activity:**
```bash
tail -f storage/logs/laravel.log | grep "KGM Webhook"
```

### 2. Check Database

**Check if leads are being saved:**

```sql
-- Check test drive submissions
SELECT * FROM test_drive_submissions 
ORDER BY created_at DESC 
LIMIT 10;

-- Check if webhook received data (look for duplicate entries)
-- When webhook works, you'll see entries from both:
-- 1. Form submission (original)
-- 2. Webhook reception (duplicate with same data)
```

### 3. Test Endpoint (Recommended)

**Use the test endpoint to verify:**

```bash
# Test webhook sending
curl -X POST https://kgm.preprodagency.com/api/webhook/test \
  -H "Content-Type: application/json"

# Check status
curl https://kgm.preprodagency.com/api/webhook/test-status
```

**Or use Postman/Browser:**
- `POST https://kgm.preprodagency.com/api/webhook/test`
- `GET https://kgm.preprodagency.com/api/webhook/test-status`

### 4. Submit Real Form

**Submit a test drive form from the frontend and check:**

1. **Form submitted** → Check DB for entry
2. **Webhook called** → Check logs for "KGM Webhook: Test drive lead sent successfully"
3. **Webhook received** → Check logs for "Webhook test drive lead processed successfully"
4. **Database** → Should have 2 entries (one from form, one from webhook)

### 5. Check Environment Variables

**Verify `.env` has correct values:**

```env
KGM_WEBHOOK_URL=https://kgm.preprodagency.com/api/webhook/kgm
KGM_WEBHOOK_ENABLED=true
```

**Check if variables are loaded:**
```bash
php artisan tinker
>>> env('KGM_WEBHOOK_URL')
=> "https://kgm.preprodagency.com/api/webhook/kgm"
```

## What to Look For

### ✅ Working Correctly:
- Logs show "Test drive lead sent successfully"
- Logs show "Webhook test drive lead processed successfully"
- Database has entries
- No error messages

### ❌ Not Working:
- Logs show "Error sending lead"
- Logs show "Failed to send test drive lead"
- No webhook entries in database
- Timeout errors (check if URL is correct)

## Common Issues

1. **"No webhook URL configured"**
   - Fix: Set `KGM_WEBHOOK_URL` in `.env`

2. **"KGM webhook sending disabled"**
   - Fix: Set `KGM_WEBHOOK_ENABLED=true` in `.env`

3. **Timeout errors**
   - Check if webhook URL is correct
   - Check if server can reach the webhook URL
   - Check firewall/network settings

4. **"Failed to encrypt data"**
   - Check PHP OpenSSL extension is enabled
   - Check server logs for encryption errors

## Quick Test Script

Create a simple test:

```bash
# Test webhook
curl -X POST https://kgm.preprodagency.com/api/webhook/test

# Check logs immediately
tail -20 storage/logs/laravel.log | grep "KGM Webhook"
```

## Production Monitoring

**Set up monitoring:**
1. Monitor `storage/logs/laravel.log` for webhook errors
2. Set up alerts for "KGM Webhook: Error" messages
3. Monitor database for missing webhook entries
4. Check webhook endpoint health regularly


<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class KgmWebhookService
{
    /**
     * Secret key for encryption
     */
    private const SECRET_KEY = 'TelusLeadZv36pG9rTHaAgmEM';

    /**
     * Secret IV for encryption
     */
    private const SECRET_IV = 'TelusLeadRCvKJudVGKdyA9HW';

    /**
     * Webhook username
     */
    private const WEBHOOK_USER = 'telusAPI';

    /**
     * Webhook password
     */
    private const WEBHOOK_PASSWORD = 'TeLuS@.2025,$';

    /**
     * Send test drive lead to KGM webhook
     */
    public function sendTestDriveLead(array $leadData, ?string $webhookUrl = null): bool
    {
        // Check if webhook sending is enabled
        if (!env('KGM_WEBHOOK_ENABLED', true)) {
            Log::info('KGM webhook sending disabled');
            return true;
        }

        try {
            // Get webhook URL from config
            $url = $webhookUrl ?? env('KGM_WEBHOOK_URL', 'https://kgm.preprodagency.com/api/webhook/kgm');

            if (!$url) {
                Log::warning('KGM Webhook: No webhook URL configured');
                return false;
            }

            // Prepare data for encryption
            $dataToEncrypt = [
                'form_type' => 'test_drive',
                'model' => $leadData['model'] ?? '',
                'nom' => $leadData['nom'] ?? '',
                'prenom' => $leadData['prenom'] ?? '',
                'telephone' => $leadData['telephone'] ?? '',
                'email' => $leadData['email'] ?? null,
                'message' => $leadData['message'] ?? null,
            ];

            // Encrypt the data
            $encryptedData = $this->encrypt(json_encode($dataToEncrypt));

            if (!$encryptedData) {
                Log::error('KGM Webhook: Failed to encrypt data');
                return false;
            }

            // Send to KGM webhook
            $response = Http::withHeaders([
                'X-Webhook-User' => self::WEBHOOK_USER,
                'X-Webhook-Password' => self::WEBHOOK_PASSWORD,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($url, [
                'data' => $encryptedData
            ]);

            if ($response->successful()) {
                Log::info('KGM Webhook: Test drive lead sent successfully');
                return true;
            } else {
                Log::warning('KGM Webhook: Failed to send test drive lead', [
                    'status' => $response->status(),
                ]);
                return false;
            }
        } catch (\Exception $e) {
            // Check if it's a timeout (data might still be processed)
            $isTimeout = strpos($e->getMessage(), 'timeout') !== false || strpos($e->getMessage(), 'timed out') !== false;

            if ($isTimeout) {
                // Timeout - data might still be processed, log as info not error
                Log::info('KGM Webhook: Timeout (data may still be processed)', [
                    'url' => $url,
                ]);
            } else {
                Log::error('KGM Webhook: Error sending lead', [
                    'error' => $e->getMessage(),
                ]);
            }
            return false;
        }
    }

    /**
     * Encrypt data using AES-256-CBC
     */
    private function encrypt(string $data): ?string
    {
        try {
            // Prepare key
            $key = substr(hash('sha256', self::SECRET_KEY), 0, 32);

            // Prepare IV
            $iv = substr(hash('sha256', self::SECRET_IV), 0, 16);

            // Encrypt
            $encrypted = openssl_encrypt(
                $data,
                'AES-256-CBC',
                $key,
                OPENSSL_RAW_DATA,
                $iv
            );

            if ($encrypted === false) {
                return null;
            }

            // Prepend IV to encrypted data and encode to base64
            $encryptedWithIv = $iv . $encrypted;
            return base64_encode($encryptedWithIv);
        } catch (\Exception $e) {
            Log::error('KGM Webhook encryption error: ' . $e->getMessage());
            return null;
        }
    }
}

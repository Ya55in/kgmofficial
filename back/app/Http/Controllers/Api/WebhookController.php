<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TestDriveSubmission;
use App\Models\ComingSoonSubmission;
use App\Mail\TestDriveFormMail;
use App\Mail\ComingSoonFormMail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Secret key for decryption
     */
    private const SECRET_KEY = 'TelusLeadZv36pG9rTHaAgmEM';

    /**
     * Secret IV for decryption
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
     * Handle webhook request for KGM leads
     */
    public function receive(Request $request): JsonResponse
    {
        // Authenticate webhook request
        $authUser = $request->header('X-Webhook-User');
        $authPassword = $request->header('X-Webhook-Password');

        if ($authUser !== self::WEBHOOK_USER || $authPassword !== self::WEBHOOK_PASSWORD) {
            Log::warning('Webhook authentication failed', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        // Get encrypted data
        $encryptedData = $request->input('data');

        if (!$encryptedData) {
            return response()->json([
                'success' => false,
                'message' => 'No data provided'
            ], 400);
        }

        try {
            // Decrypt the data
            $decryptedData = $this->decrypt($encryptedData);

            if (!$decryptedData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to decrypt data'
                ], 400);
            }

            // Parse JSON data
            $leadData = json_decode($decryptedData, true);

            if (!$leadData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid JSON data'
                ], 400);
            }

            // Determine form type and process accordingly
            $formType = $leadData['form_type'] ?? 'test_drive';

            if ($formType === 'coming_soon') {
                return $this->processComingSoonLead($leadData, $request);
            } else {
                return $this->processTestDriveLead($leadData, $request);
            }
        } catch (\Exception $e) {
            Log::error('Webhook processing error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error processing webhook',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Decrypt encrypted data using AES-256-CBC
     */
    private function decrypt(string $encryptedData): ?string
    {
        try {
            // Decode base64
            $encryptedData = base64_decode($encryptedData);

            if ($encryptedData === false) {
                return null;
            }

            // Extract IV (first 16 bytes) and encrypted content
            $iv = substr($encryptedData, 0, 16);
            $encrypted = substr($encryptedData, 16);

            // Use provided SECRET_IV if IV extraction fails
            if (strlen($iv) !== 16) {
                $iv = substr(hash('sha256', self::SECRET_IV), 0, 16);
            }

            // Prepare key
            $key = substr(hash('sha256', self::SECRET_KEY), 0, 32);

            // Decrypt
            $decrypted = openssl_decrypt(
                $encrypted,
                'AES-256-CBC',
                $key,
                OPENSSL_RAW_DATA,
                $iv
            );

            return $decrypted !== false ? $decrypted : null;
        } catch (\Exception $e) {
            Log::error('Decryption error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Process test drive lead
     */
    private function processTestDriveLead(array $leadData, Request $request): JsonResponse
    {
        $validator = Validator::make($leadData, [
            'model' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'message' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            Log::warning('Webhook validation failed for test drive', [
                'errors' => $validator->errors()->toArray(),
                'data' => $leadData,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $submission = TestDriveSubmission::create([
                'model' => $leadData['model'],
                'nom' => $leadData['nom'],
                'prenom' => $leadData['prenom'],
                'telephone' => $leadData['telephone'],
                'email' => $leadData['email'] ?? null,
                'message' => $leadData['message'] ?? null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // No email notification for webhook (to avoid duplicates)
            // Email is already sent when form is submitted directly

            Log::info('Webhook test drive lead processed successfully', [
                'submission_id' => $submission->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Lead processed successfully',
                'data' => $submission
            ], 201);
        } catch (\Exception $e) {
            Log::error('Webhook test drive submission error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error processing lead',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Process coming soon lead
     */
    private function processComingSoonLead(array $leadData, Request $request): JsonResponse
    {
        $validator = Validator::make($leadData, [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'ville' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            Log::warning('Webhook validation failed for coming soon', [
                'errors' => $validator->errors()->toArray(),
                'data' => $leadData,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $submission = ComingSoonSubmission::create([
                'nom' => $leadData['nom'],
                'prenom' => $leadData['prenom'],
                'telephone' => $leadData['telephone'],
                'email' => $leadData['email'],
                'ville' => $leadData['ville'] ?? null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // No email notification for webhook (to avoid duplicates)
            // Email is already sent when form is submitted directly

            Log::info('Webhook coming soon lead processed successfully', [
                'submission_id' => $submission->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Lead processed successfully',
                'data' => $submission
            ], 201);
        } catch (\Exception $e) {
            Log::error('Webhook coming soon submission error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error processing lead',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}

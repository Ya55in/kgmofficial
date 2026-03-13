<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\KgmWebhookService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class WebhookTestController extends Controller
{
    /**
     * Test webhook encryption and sending
     */
    public function test(Request $request): JsonResponse
    {
        try {
            // Sample test data
            $testData = [
                'model' => $request->input('model', 'TORRES'),
                'nom' => $request->input('nom', 'Test'),
                'prenom' => $request->input('prenom', 'User'),
                'telephone' => $request->input('telephone', '+212 6 12 34 56 78'),
                'email' => $request->input('email', 'test@example.com'),
                'message' => $request->input('message', 'Test message'),
            ];

            $kgmWebhookService = new KgmWebhookService();
            $result = $kgmWebhookService->sendTestDriveLead($testData);

            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Webhook test sent! Check logs and database.',
                    'test_data' => $testData,
                    'webhook_url' => $webhookUrl ?? env('KGM_WEBHOOK_URL', 'http://localhost:8000/api/webhook/kgm'),
                    'force_local' => $request->input('force_local', false),
                    'instructions' => [
                        '1' => 'Check storage/logs/laravel.log for detailed logs',
                        '2' => 'Check test_drive_submissions table in database',
                        '3' => 'If testing localhost, set KGM_WEBHOOK_FORCE_LOCAL=true in .env',
                        '4' => 'Or use ?force_local=1 in the request to force localhost test'
                    ]
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Webhook test failed. Check logs for details.',
                    'test_data' => $testData,
                    'note' => 'Check storage/logs/laravel.log for error details'
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Webhook test error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error during webhook test',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Test webhook status and show instructions
     */
    public function status(): JsonResponse
    {
        $webhookUrl = env('KGM_WEBHOOK_URL', 'http://localhost:8000/api/webhook/kgm');
        $webhookEnabled = env('KGM_WEBHOOK_ENABLED', true);
        $forceLocal = env('KGM_WEBHOOK_FORCE_LOCAL', false);

        return response()->json([
            'success' => true,
            'message' => 'Webhook testing endpoints',
            'current_config' => [
                'KGM_WEBHOOK_URL' => $webhookUrl,
                'KGM_WEBHOOK_ENABLED' => $webhookEnabled,
                'KGM_WEBHOOK_FORCE_LOCAL' => $forceLocal,
            ],
            'endpoints' => [
                'test_send' => [
                    'url' => '/api/webhook/test',
                    'method' => 'POST',
                    'description' => 'Test sending encrypted data to webhook',
                    'query_params' => [
                        'force_local' => '1 (optional) - Force sending to localhost even if loop detected'
                    ],
                    'body' => [
                        'model' => 'TORRES (optional)',
                        'nom' => 'Test (optional)',
                        'prenom' => 'User (optional)',
                        'telephone' => '+212 6 12 34 56 78 (optional)',
                        'email' => 'test@example.com (optional)',
                        'message' => 'Test message (optional)'
                    ],
                    'example' => 'POST /api/webhook/test?force_local=1'
                ],
                'test_receive' => [
                    'url' => '/api/webhook/kgm',
                    'method' => 'POST',
                    'description' => 'Test receiving encrypted data',
                    'headers' => [
                        'X-Webhook-User' => 'telusAPI',
                        'X-Webhook-Password' => 'TeLuS@.2025,$',
                        'Content-Type' => 'application/json'
                    ],
                    'body' => [
                        'data' => 'base64_encrypted_string'
                    ]
                ]
            ],
            'how_to_test' => [
                'method_1' => [
                    'title' => 'Quick Test (Recommended)',
                    'steps' => [
                        '1' => 'Set KGM_WEBHOOK_FORCE_LOCAL=true in .env',
                        '2' => 'POST to /api/webhook/test',
                        '3' => 'Check logs: storage/logs/laravel.log',
                        '4' => 'Check database: test_drive_submissions table'
                    ]
                ],
                'method_2' => [
                    'title' => 'Test with Query Parameter',
                    'steps' => [
                        '1' => 'POST to /api/webhook/test?force_local=1',
                        '2' => 'Check logs and database',
                        '3' => 'No .env changes needed'
                    ]
                ],
                'method_3' => [
                    'title' => 'Test Real Webhook Flow',
                    'steps' => [
                        '1' => 'Submit a real test drive form',
                        '2' => 'Check logs for webhook sending',
                        '3' => 'If localhost, it will be skipped unless KGM_WEBHOOK_FORCE_LOCAL=true'
                    ]
                ]
            ],
            'troubleshooting' => [
                'localhost_skipped' => 'If you see "Skipping localhost loop", set KGM_WEBHOOK_FORCE_LOCAL=true in .env',
                'timeout' => 'If timeout occurs, check that Laravel server is running on port 8000',
                'no_logs' => 'Check storage/logs/laravel.log for all webhook activity'
            ]
        ], 200);
    }
}

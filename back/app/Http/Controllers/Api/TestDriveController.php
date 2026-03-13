<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TestDriveSubmission;
use App\Mail\TestDriveFormMail;
use App\Services\KgmWebhookService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class TestDriveController extends Controller
{
    /**
     * Handle test drive form submission
     */
    public function submit(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'model' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'message' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $submission = TestDriveSubmission::create([
                'model' => $request->model,
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'telephone' => $request->telephone,
                'email' => $request->email,
                'message' => $request->message,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Send email notification
            try {
                $recipientEmail = env('FORM_NOTIFICATION_EMAIL', 'kgmmorocco@gmail.com');
                Mail::to($recipientEmail)->send(new TestDriveFormMail($submission));
            } catch (\Exception $mailException) {
                // Log email error but don't fail the form submission
                \Log::error('Test drive email sending failed: ' . $mailException->getMessage());
            }

            // Send to KGM webhook asynchronously (non-blocking - don't fail if webhook fails)
            // The service will check KGM_WEBHOOK_ENABLED and skip localhost loops automatically
            // Dispatch asynchronously to not block form response
            dispatch(function () use ($submission) {
                try {
                    $kgmWebhookService = new KgmWebhookService();
                    $kgmWebhookService->sendTestDriveLead([
                        'model' => $submission->model,
                        'nom' => $submission->nom,
                        'prenom' => $submission->prenom,
                        'telephone' => $submission->telephone,
                        'email' => $submission->email,
                        'message' => $submission->message,
                    ]);
                } catch (\Exception $webhookException) {
                    // Log webhook error but don't fail the form submission
                    \Log::error('KGM webhook sending failed: ' . $webhookException->getMessage());
                }
            })->afterResponse();

            return response()->json([
                'success' => true,
                'message' => 'Merci ! Nous vous contacterons pour confirmer votre rendez-vous.',
                'data' => $submission
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Test drive form submission error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}

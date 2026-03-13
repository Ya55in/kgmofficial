<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ComingSoonSubmission;
use App\Mail\ComingSoonFormMail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class ComingSoonController extends Controller
{
    /**
     * Handle coming soon form submission
     */
    public function submit(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'ville' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $submission = ComingSoonSubmission::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'telephone' => $request->telephone,
                'email' => $request->email,
                'ville' => $request->ville,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Send email notification
            try {
                $recipientEmail = env('FORM_NOTIFICATION_EMAIL', 'kgmmorocco@gmail.com');
                Mail::to($recipientEmail)->send(new ComingSoonFormMail($submission));
            } catch (\Exception $mailException) {
                // Log email error but don't fail the form submission
                \Log::error('Coming soon email sending failed: ' . $mailException->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Merci ! Nous vous tiendrons informé lors du lancement.',
                'data' => $submission
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Coming soon form submission error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}

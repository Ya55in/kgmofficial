<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle demande d'essai - KGM Mobility</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2d294e 0%, #1a1730 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 8px 0; letter-spacing: -0.5px;">Nouvelle Demande d'Essai</h1>
                            <div style="color: #d4be83; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Test Drive Booking</div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0 0 32px 0; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
                                Une nouvelle demande d'essai a été soumise sur le site KGM Mobility.
                            </p>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Modèle</div>
                                        <div style="font-size: 16px; color: #111827; font-weight: 500; text-transform: uppercase;">{{ strtoupper($submission->model) }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Prénom</div>
                                        <div style="font-size: 16px; color: #111827; font-weight: 500;">{{ $submission->prenom }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Nom</div>
                                        <div style="font-size: 16px; color: #111827; font-weight: 500;">{{ $submission->nom }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Téléphone</div>
                                        <div style="font-size: 16px; color: #111827; font-weight: 500;">{{ $submission->telephone }}</div>
                                    </td>
                                </tr>
                                @if($submission->email)
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Email</div>
                                        <div style="font-size: 16px; color: #2d294e; font-weight: 500;">
                                            <a href="mailto:{{ $submission->email }}" style="color: #2d294e; text-decoration: none;">{{ $submission->email }}</a>
                                        </div>
                                    </td>
                                </tr>
                                @endif
                                @if($submission->message)
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Message</div>
                                        <div style="font-size: 15px; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">{{ $submission->message }}</div>
                                    </td>
                                </tr>
                                @endif
                            </table>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                                <tr>
                                    <td>
                                        <p style="font-size: 12px; color: #9ca3af; margin: 4px 0;"><strong>Date de demande:</strong> {{ $submission->created_at->format('d/m/Y à H:i') }}</p>
                                        <p style="font-size: 12px; color: #9ca3af; margin: 4px 0;"><strong>Adresse IP:</strong> {{ $submission->ip_address }}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <div style="font-size: 18px; font-weight: 700; color: #2d294e; margin-bottom: 8px; letter-spacing: 1px;">KGM</div>
                            <div style="font-size: 13px; color: #6b7280; margin-bottom: 20px; font-style: italic;">Enjoy with Confidence</div>
                            <div style="font-size: 11px; color: #9ca3af; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                &copy; {{ date('Y') }} KGM Mobility. Tous droits réservés.
                            </div>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>



Nouvelle demande d'essai - KGM Mobility
========================================

Une nouvelle demande d'essai a été soumise sur le site KGM Mobility.

INFORMATIONS DE LA DEMANDE
--------------------------

Modèle: {{ strtoupper($submission->model) }}
Prénom: {{ $submission->prenom }}
Nom: {{ $submission->nom }}
Téléphone: {{ $submission->telephone }}
@if($submission->email)
Email: {{ $submission->email }}
@endif
@if($submission->message)
Message: {{ $submission->message }}
@endif

Date de demande: {{ $submission->created_at->format('d/m/Y à H:i') }}
Adresse IP: {{ $submission->ip_address }}

---
KGM
Enjoy with Confidence

© {{ date('Y') }} KGM Mobility. Tous droits réservés.



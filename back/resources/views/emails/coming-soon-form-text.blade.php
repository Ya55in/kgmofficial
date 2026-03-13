Nouvelle inscription Coming Soon - KGM Mobility
================================================

Une nouvelle personne s'est inscrite pour être notifiée lors du lancement du site KGM Mobility.

INFORMATIONS DE L'INSCRIT
-------------------------

Prénom: {{ $submission->prenom }}
Nom: {{ $submission->nom }}
Email: {{ $submission->email }}
Téléphone: {{ $submission->telephone }}
@if($submission->ville)
Ville: {{ $submission->ville }}
@endif

Date d'inscription: {{ $submission->created_at->format('d/m/Y à H:i') }}
Adresse IP: {{ $submission->ip_address }}

---
KGM
Enjoy with Confidence

© {{ date('Y') }} KGM Mobility. Tous droits réservés.


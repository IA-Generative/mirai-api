### Soumettre un job

`POST /jobs/{service_type}/`

Le fichier est soumis, un job_id est retourné immédiatement. Le résultat est récupéré ultérieurement par polling ou via webhook.

Adapté aux : traitements en batch, architectures événementielles, fichiers volumineux ou longs.

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/jobs/transcription \
  -F file=@audio.wav \
  -F model=whisper-large-v3 \
  -F callback_url=https://myapp.com/webhook

{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "service_type": "transcription",
  "model": "whisper-large-v3",
  "status": "pending"
}
```

### Webhook

Fournir un `callback_url` pour être notifié dès la complétion du job async, sans polling.

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/jobs/audio \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@conference.mp3" \
  -F "callback_url=https://mon-app.example.com/hooks/ia"
```

Le gateway effectue un `POST` sur cette URL avec le résultat complet dès que le job est terminé.

En cas d'échec HTTP côté récepteur : **3 tentatives** avec backoff exponentiel (2 s → 4 s → 8 s).

### Consulter un job

`GET /jobs/{service_type}/{id}`

### Cycle de vie d'un job

```bash
POST /jobs/audio
      ↓
202 Accepted  { "job_id": "550e8400-..." }
      ↓
GET /jobs/audio/{job_id}  →  { "status": "pending", "queue_position": 3 }
      ↓
GET /jobs/audio/{job_id}  →  { "status": "processing" }
      ↓
GET /jobs/audio/{job_id}  →  { "status": "completed", "result": {...} }
```

En attente :
```bash
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "service_type": "transcription",
  "model": "whisper-large-v3",
  "status": "pending",
  "queue_position": 3,
  "created_at": "2026-06-29T10:00:00Z",
  "updated_at": "2026-06-29T10:00:00Z"
}
```

Terminé — le résultat est inliné directement, pas besoin d'un second appel :
```bash
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "service_type": "transcription",
  "model": "whisper-large-v3",
  "status": "completed",
  "result": { "text": "Bonjour, ceci est une transcription." },
  "created_at": "2026-06-29T10:00:00Z",
  "updated_at": "2026-06-29T10:02:34Z"
}
```

En erreur :
```bash
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "failed",
  "error": "inference model returned 500",
  "created_at": "2026-06-29T10:00:00Z",
  "updated_at": "2026-06-29T10:01:05Z"
}
```

### Lister ses jobs 

`GET /jobs?limit=20&offset=0`
```bash
{
  "consumer": "my-api-key",
  "total": 42,
  "limit": 20,
  "offset": 0,
  "jobs": [
    {
      "job_id": "550e8400-...",
      "service_type": "transcription",
      "model": "whisper-large-v3",
      "status": "completed",
      "created_at": "2026-06-29T10:00:00Z",
      "updated_at": "2026-06-29T10:02:34Z"
    },
    {
      "job_id": "661f9511-...",
      "service_type": "transcription",
      "model": "whisper-large-v3",
      "status": "pending",
      "queue_position": 1,
      "created_at": "2026-06-29T10:05:00Z",
      "updated_at": "2026-06-29T10:05:00Z"
    }
  ]
}
```


### Annuler un job 

`DELETE /jobs/{service_type}/{id}`

Possible uniquement si le job est encore pending ou processing. Réponse 202 sans body.

Si le job est déjà completed ou failed :
```bash
{ "error": "job \"550e8400-...\" cannot be cancelled in state \"completed\"" }
```
---

### Durée de vie des jobs et GC

Les jobs non traités ne restent pas indéfiniment dans le système. Deux mécanismes s'appliquent :

TTL statut **72H**, passé ce délai, le job n'est plus consultable.

Jobs pending trop anciens **>4h** : tout job resté pending au-delà d'un seuil configuré est considéré perdu. L'api supprime le job et efface le fichier d'entrée.

En pratique : si vous soumettez un job et ne le récupérez pas avant l'expiration du TTL, il est définitivement perdu. Configurez un webhook (callback_url) ou sondez régulièrement pour éviter de manquer la fenêtre.
# Modes d'appel

MirAI API's propose deux modes d'appel selon la durée du traitement et les contraintes de votre application.

| Mode | Endpoint | Réponse | Adapté à |
|---|---|---|---|
| [Synchrone](#mode-synchrone) | `POST /v1/*` | Inline, connexion maintenue | LLM, embeddings, reranking, audio court |
| [Asynchrone](#mode-asynchrone) | `POST /jobs/audio` | `job_id` → polling ou webhook | Audio long, batch |

---

## Mode synchrone

La connexion reste ouverte jusqu'à la fin du traitement. La requête est forwardée directement au backend d'inférence et la réponse est streamée au client.

**Utilisé par :** LLM (`/v1/chat/completions`), embeddings (`/v1/embeddings`), reranking (`/v1/rerank`), transcription audio (`/v1/audio/transcriptions`).

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/chat/completions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"model": "chat-smart", "messages": [{"role": "user", "content": "Bonjour"}]}'
```

---

## Mode asynchrone

Le fichier est soumis, un `job_id` est retourné immédiatement. Le résultat est récupéré ultérieurement par **polling** ou via **webhook**.

**Adapté aux :** traitements en batch, architectures événementielles, fichiers volumineux ou longs.

### Cycle de vie d'un job

```
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

### Soumission

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/jobs/audio \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@conference.mp3"
# → {"job_id": "550e8400-e29b-41d4-a716-446655440000"}
```

### Polling

```bash
curl https://gateway.api.ai.numerique-interieur.com/jobs/audio/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <TOKEN>"
```

Réponse en attente :

```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "queue_position": 3
}
```

Réponse complétée :

```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "result": {
    "text": "Bonjour, bienvenue à cette réunion..."
  }
}
```

### Script de polling complet (bash)

```bash
JOB=$(curl -s -X POST https://gateway.api.ai.numerique-interieur.com/jobs/audio \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@conference.mp3")

JOB_ID=$(echo $JOB | jq -r '.job_id')

until [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ]; do
  RESPONSE=$(curl -s https://gateway.api.ai.numerique-interieur.com/jobs/audio/$JOB_ID \
    -H "Authorization: Bearer <TOKEN>")
  STATUS=$(echo $RESPONSE | jq -r '.status')
  POSITION=$(echo $RESPONSE | jq -r '.queue_position // "—"')
  echo "Status: $STATUS  |  Position: $POSITION"
  sleep 5
done

echo $RESPONSE | jq '.result'
```

---

## Webhook

Fournir un `callback_url` pour être notifié dès la complétion du job async, sans polling.

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/jobs/audio \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@conference.mp3" \
  -F "callback_url=https://mon-app.example.com/hooks/ia"
```

Le gateway effectue un `POST` sur cette URL avec le résultat complet dès que le job est terminé.

En cas d'échec HTTP côté récepteur : **3 tentatives** avec backoff exponentiel (2 s → 4 s → 8 s).

---

## Lister ses jobs

Chaque consommateur peut consulter ses propres jobs :

```bash
curl "https://gateway.api.ai.numerique-interieur.com/jobs?limit=10" \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Durée de rétention

Les jobs async et leurs résultats sont conservés **72 heures**. Stocker le résultat côté application dès réception.

# Modes d'appel

MirAI API's propose deux modes d'appel selon la durée du traitement et les contraintes de votre application.

---

## Mode synchrone

La connexion reste ouverte jusqu'à la fin du traitement. La réponse est retournée directement dans la réponse HTTP.

**Adapté aux :** LLM, embeddings, reranking, et fichiers audio courts (< 30 s).

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/audio/transcriptions \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@interview.wav"
# → {"text": "Bonjour, bienvenue..."}
```

---

## Mode asynchrone

Le fichier est soumis, un `job_id` est retourné immédiatement. Le résultat est récupéré ultérieurement par **polling** ou via **webhook**.

**Adapté aux :** fichiers audio longs (> 30 s), traitements en batch, architectures événementielles.

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

Fournir un `callback_url` pour être notifié dès la complétion du job, sans polling.

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

Chaque consommateur peut consulter ses propres jobs des 72 dernières heures :

```bash
curl "https://gateway.api.ai.numerique-interieur.com/jobs?limit=10" \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Durée de rétention

> Les résultats sont automatiquement supprimés après leur **première lecture** ou au bout de **24 heures**. Stocker le résultat côté application dès réception.

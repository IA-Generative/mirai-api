# Modes d'appel

MirAI API's propose trois modes d'appel selon la durée du traitement et les contraintes de votre application.

| Mode | Endpoint | Réponse | Adapté à |
|---|---|---|---|
| [Synchrone direct](#mode-synchrone-direct) | `POST /v1/*` | Inline, connexion maintenue | LLM, embeddings, reranking |
| [Synchrone via Kafka](#sync-over-kafka) | `POST /v1/audio/*` | Inline, connexion maintenue | Audio (priorité, résultat inline) |
| [Asynchrone](#mode-asynchrone) | `POST /jobs/audio` | `job_id` → polling ou webhook | Audio long, batch |

---

## Mode synchrone direct

La connexion reste ouverte jusqu'à la fin du traitement. La requête est forwardée directement au backend d'inférence.

**Utilisé par :** LLM (`/v1/chat/completions`), embeddings (`/v1/embeddings`), reranking (`/v1/rerank`).

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/chat/completions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"model": "chat-smart", "messages": [{"role": "user", "content": "Bonjour"}]}'
```

---

## Sync-over-Kafka

Même endpoint que le mode direct (`POST /v1/audio/*`), mais le gateway route le fichier via Kafka avec **priorité sur les jobs asynchrones**. La connexion reste ouverte ; le résultat est retourné inline à la complétion.

**Comportement interne :**
1. Le fichier est uploadé en S3
2. L'événement est publié sur le topic Kafka prioritaire
3. Le relay traite le job en priorité (met en attente les jobs async en cours)
4. Le gateway reçoit la notification Redis et retourne le résultat directement

Pour les longues inférences (> 20 s), le gateway envoie des **newlines keepalive** toutes les 20 s pour éviter les coupures de proxies intermédiaires. Timeout maximum : 15 min.

> Le job Kafka prioritaire et ses fichiers S3 sont supprimés dès la complétion — ils ne sont pas conservés 24 h contrairement aux jobs async.

```bash
# Même endpoint que le direct — le routage via Kafka est transparent
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/audio/transcriptions \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@conference.mp3"
# → {"text": "Bonjour, bienvenue..."} (retourné inline après inférence)
```

---

## Mode asynchrone

Le fichier est soumis, un `job_id` est retourné immédiatement. Le résultat est récupéré ultérieurement par **polling** ou via **webhook**.

**Adapté aux :** traitements en batch, architectures événementielles, fichiers volumineux.

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

Chaque consommateur peut consulter ses propres jobs des **24 dernières heures** :

```bash
curl "https://gateway.api.ai.numerique-interieur.com/jobs?limit=10" \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Durée de rétention

Les jobs async et leurs résultats sont conservés **24 heures** dans Redis. Le fichier résultat (S3) est supprimé dès la **première lecture** — stocker le résultat côté application dès réception.

> Les jobs sync-over-Kafka ne sont pas listables et ne persistent pas : résultat et job record sont supprimés dès la complétion.

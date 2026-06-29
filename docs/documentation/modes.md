# Modes d'appel

MirAI API's propose deux modes d'appel selon la durée du traitement et les contraintes de votre application.

| Mode                           | Endpoint           | Réponse                       | Adapté à                                |
| ------------------------------ | ------------------ | ----------------------------- | --------------------------------------- |
| [Synchrone](#mode-synchrone)   | `POST /v1/*`       | Inline, connexion maintenue   | LLM, embeddings, reranking, audio court |
| [Asynchrone](#mode-asynchrone) | `POST /jobs/audio` | `job_id` → polling ou webhook | Audio long, batch                       |

---

## Mode synchrone

La connexion reste ouverte jusqu'à la fin du traitement. La requête est forwardée directement au backend d'inférence et la réponse est streamée au client.

**Utilisé par :** LLM (`/v1/chat/completions`), embeddings (`/v1/embeddings`), reranking (`/v1/rerank`), transcription audio (`/v1/audio/transcriptions`).

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/chat/completions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"model": "chat-pro", "messages": [{"role": "user", "content": "Bonjour"}]}'
```

---

## Mode asynchrone

**Adapté aux :** traitements en batch, architectures événementielles, fichiers volumineux ou longs.

Détail : [Asynchrone](#jobs)
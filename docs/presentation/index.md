# MirAI API's

MirAI API's est la plateforme d'inférence IA du ministère. Elle expose une API unifiée et standardisée pour consommer des modèles d'intelligence artificielle — audio, texte, recherche sémantique — sans se préoccuper de l'infrastructure sous-jacente.

**Endpoint de production :** `https://gateway.api.ai.numerique-interieur.com`

**Documentation interactive (Swagger) :** `https://gateway.api.ai.numerique-interieur.com/docs`

---

## À qui s'adresse cette offre

- **Équipes de développement** souhaitant intégrer l'IA dans leurs applications métier
- **Data scientists et équipes data** construisant des pipelines de traitement audio ou texte
- **Intégrateurs** cherchant une compatibilité OpenAI sans dépendance à un fournisseur externe

---

## Pourquoi MirAI API's

### Compatibilité OpenAI
Tous les endpoints LLM, audio et embeddings sont compatibles avec le SDK OpenAI. Si votre application utilise déjà `openai.ChatCompletion` ou `openai.Audio.transcribe`, il suffit de changer le `base_url` — aucune réécriture de code.

### Infrastructure souveraine
Les modèles tournent sur des serveurs GPU hébergés en France chez **Scaleway**, opérateur cloud français. Les données restent sur le territoire national et ne transitent pas vers des fournisseurs de cloud extra-européens.

### Async natif
Les traitements longs (audio 1 h, batches de documents) passent par un pipeline asynchrone Kafka : soumettez votre job, récupérez le résultat quand il est prêt — par polling ou webhook — sans maintenir la connexion ouverte.

### Modèles mesurés
Les performances sont issues de benchmarks réels, pas de promesses marketing. Les chiffres présentés dans cette documentation sont mesurés en conditions de production.

---

## Services disponibles

| Service | Statut | Modèle | Endpoint |
|---|---|---|---|
| Transcription audio | **Beta** | faster-whisper-large-v3-turbo | `POST /v1/audio/transcriptions` |
| Traduction audio | **Beta** | faster-whisper-large-v3-turbo | `POST /v1/audio/translations` |
| Diarisation audio | **Beta** | pyannote-diarization | `POST /v1/audio/diarizations` |
| Chat LLM | **Stable** | 8 modèles disponibles | `POST /v1/chat/completions` |
| Embeddings | **Beta** | bge-m3 | `POST /v1/embeddings` |
| Reranking | **Beta** | bge-reranker-v2-m3 | `POST /v1/rerank` |

---

## Accès

| Type | Obtention |
|---|---|
| **Utilisateur individuel** | Via **MyMirAI** — *pas encore disponible* |
| **Application / compte de service** | Via la SDID — voir [Authentification](/documentation/authentification) |

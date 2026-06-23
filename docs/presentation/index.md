# MirAI API's

MirAI API's est la plateforme d'inférence IA du ministère. Elle expose une API unifiée et standardisée pour consommer des modèles d'intelligence artificielle — audio, texte, recherche sémantique — sans se préoccuper de l'infrastructure sous-jacente.

**Endpoint de production :** https://gateway.api.ai.numerique-interieur.com

**Documentation interactive (Swagger) :** https://gateway.api.ai.numerique-interieur.com/docs

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
Les traitements longs (audio 1 h, batches de documents) passent par une file asynchrone Redis : soumettez votre job, récupérez le résultat quand il est prêt — par polling ou webhook — sans maintenir la connexion ouverte.

### Modèles mesurés
Les performances sont issues de benchmarks réels, pas de promesses marketing. Les chiffres présentés dans cette documentation sont mesurés en conditions de production.

---

## Gateway

Toutes les requêtes transitent par une gateway centralisée accessible à l'adresse https://gateway.api.ai.numerique-interieur.com. Elle est responsable de :

- **Routage** — chaque requête est dirigée vers le bon service selon le modèle et le type d'opération
- **Rate limiting** — application des quotas par consommateur en fenêtre fixe
- **Détection PII** — les données personnelles identifiables (e-mail, téléphone, IBAN, carte bancaire, SIREN/SIRET) peuvent être détectées et bloquées avant transmission au modèle
- **Cache** — les requêtes identiques sont mises en cache (TTL configurable) pour réduire la latence et la consommation
- **Traitement asynchrone** — les jobs longs (audio, batches) passent par une file avec scaling automatique
- **Observabilité** — métriques et traces exposées par consommateur

---

## Services disponibles

| Service             | Statut     | Modèle                        | Endpoint                        |
| ------------------- | ---------- | ----------------------------- | ------------------------------- |
| Transcription audio | **Beta**   | faster-whisper-large-v3-turbo | `POST /v1/audio/transcriptions` |
| Traduction audio    | **Beta**   | faster-whisper-large-v3-turbo | `POST /v1/audio/translations`   |
| Diarisation audio   | **Beta**   | pyannote-diarization          | `POST /v1/audio/diarizations`   |
| Chat LLM            | **Stable** | 8 modèles disponibles         | `POST /v1/chat/completions`     |
| Embeddings          | **Beta**   | bge-m3                        | `POST /v1/embeddings`           |
| Reranking           | **Beta**   | bge-reranker-v2-m3            | `POST /v1/rerank`               |

---

## Accès

| Niveau          | Profil                                | Obtention                                 |
| --------------- | ------------------------------------- | ----------------------------------------- |
| **Découverte**  | Utilisateur individuel                | Via **MyMirAI** — *pas encore disponible* |
| **Intégration** | Application en développement / pilote | Via la SDID                               |
| **Production**  | Application métier en production      | Via la SDID                               |
| **Critique**    | Service haute disponibilité           | Via la SDID — sur demande                 |

Voir [Quotas et niveaux d'accès](/documentation/quotas) pour le détail des limites par niveau.

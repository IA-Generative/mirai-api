# Changelog

Historique des évolutions de MirAI API's — modèles, quotas, endpoints et comportements.

---
## Aout 2026

### Modèles
- Suppression de `mistral-medium-albert` (API Albert/Etalab)

---

## Juillet 2026

### Nouveautés
- **Vision** — Ajout du service de compréhension d'images, modèle `Qwen3-VL-8B-Instruct`. Compatible OpenAI via `POST /v1/chat/completions` (contenu `image_url`, par URL ou base64). Description, OCR, VQA, lecture de documents. Taille de requête maximale : 50 Mo.

---

## Juin 2026

### Nouveautés
- **Niveaux d'accès** — Introduction de cinq niveaux (Découverte, Développeur, Intégration, Production, Critique) en remplacement de la distinction Utilisateur / Application. Les niveaux Découverte et Développeur sont individuels (self-service via MyMirAI) ; Intégration, Production et Critique sont dédiés au service d'applications.
- **Gateway** — Mise en production de la gateway centralisée : rate limiting par consommateur, détection PII, cache Redis, observabilité Prometheus
- **Traitement asynchrone** — Migration de la file de jobs vers Redis avec scaling automatique KEDA
- **Rétention** — Durée de rétention des jobs async portée à **72 heures**

### Modèles
- Ajout de `chat-pro` (remplace `chat-smart`)
- `chat-small` renommé en `chat`
- `tools` (120B) renommé en `tools-pro` ; `tools` désigne désormais le modèle rapide 26B
- `code` et `code-completion` migrent vers **Qwen3.6-35B-A3B**
- Retrait de `mistral-small-24b` et `guardrail`
- Ajout de `mistral-medium-albert` (API Albert/Etalab)

### Documentation
- Suppression du mode Sync-over-Kafka
- Ajout de la FAQ, de la référence des erreurs et du changelog
- Ajout des quotas journaliers par niveau
- Ajout diarization via transcription
- Ajout jobs page
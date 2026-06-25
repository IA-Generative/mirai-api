# Changelog

Historique des évolutions de MirAI API's — modèles, quotas, endpoints et comportements.

---

## Juin 2026

### Nouveautés
- **Niveaux d'accès** — Introduction de quatre niveaux (Découverte, Intégration, Production, Critique) en remplacement de la distinction Utilisateur / Application
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

# Quotas et niveaux d'accès

Les quotas sont déterminés par le **niveau d'accès** associé à votre token. Cinq niveaux sont disponibles, répartis sur deux axes d'usage : **individuel** (self-service) et **application** (via l'équipe MirAI).

---

## Niveaux d'accès

| Niveau           | Axe         | Profil                                                                 | Obtention                                |
| ---------------- | ----------- | --------------------------------------------------------------------- | ---------------------------------------- |
| **Découverte**   | Individuel  | Tests, scripts, outils personnels — premiers pas                      | Via MyMirAI *(pas encore disponible)*    |
| **Développeur**  | Individuel  | Prototypage, assistants de code (Claude Code, Copilot…) — usage soutenu | Via MyMirAI *(pas encore disponible)*    |
| **Intégration**  | Application | Application en phase de développement ou pilote                        | Via l'équipe MirAI                       |
| **Production**   | Application | Application métier standard déployée en production                     | Via l'équipe MirAI                       |
| **Critique**     | Application | Service haute disponibilité ou forte volumétrie                       | Via l'équipe MirAI — défini sur demande  |

Les niveaux **Découverte** et **Développeur** sont individuels et destinés à être auto-souscrits via MyMirAI. Les niveaux **Intégration**, **Production** et **Critique** sont dédiés au service d'applications et provisionnés par l'équipe MirAI. Les limites du niveau **Critique** sont définies au cas par cas selon les besoins réels de l'application.

---

## Quotas par service

### LLM — `POST /v1/chat/completions`

|                   | Découverte | Développeur | Intégration | Production  | Critique           |
| ----------------- | ---------- | ----------- | ----------- | ----------- | ------------------ |
| Requêtes / minute | 10         | 30          | 60          | 200         | Défini par l'équipe MirAI |
| Tokens / minute   | 30 000     | 150 000     | 200 000     | 500 000     | Défini par l'équipe MirAI |
| Tokens / jour     | 500 000    | 5 000 000   | 10 000 000  | 100 000 000 | Défini par l'équipe MirAI |

> Le niveau **Développeur** offre une fenêtre tokens/minute élevée (150 000) pour absorber les rafales des assistants de code, qui envoient de gros contextes à chaque requête.
>
> À titre de référence : `chat-pro` (120B) délivre ~135 tok/s soit ~8 100 tok/min par session. Le plafond tokens/jour s'applique **par modèle**.

---

### Audio — Transcription & Diarisation <Badge type="warning" text="Beta" />

Les traitements audio étant longs (jusqu'à ~7 min pour 1 h d'audio), le quota est exprimé en **jobs simultanés** et **Temps de traitement par jour** plutôt qu'en requêtes par minute.

|                            | Découverte | Développeur | Intégration | Production | Critique           |
| -------------------------- | ---------- | ----------- | ----------- | ---------- | ------------------ |
| Jobs simultanés            | 1          | 3           | 4           | 10         | Défini par l'équipe MirAI |
| Temps de traitement / jour | 3600       | 7200        | 21600       | 43200      | Défini par l'équipe MirAI |
| Taille max par fichier     | 1 Go       | 1 Go        | 1 Go        | 1 Go       | 1 Go               |

> Le débit global est partagé entre tous les consommateurs. En cas de file d'attente, la position est indiquée dans la réponse polling (`queue_position`).

---

### Embeddings <Badge type="warning" text="Beta" />

|                   | Découverte | Développeur | Intégration | Production | Critique           |
| ----------------- | ---------- | ----------- | ----------- | ---------- | ------------------ |
| Requêtes / minute | 100        | 300         | 500         | 2 000      | Défini par l'équipe MirAI |
| Requêtes / jour   | 50 000     | 150 000     | 500 000     | 5 000 000  | Défini par l'équipe MirAI |

> La capacité système est de 410 req/s (~24 600 req/min).

---

### Reranking <Badge type="warning" text="Beta" />

|                   | Découverte | Développeur | Intégration | Production | Critique           |
| ----------------- | ---------- | ----------- | ----------- | ---------- | ------------------ |
| Requêtes / minute | 200        | 600         | 1 000       | 4 000      | Défini par l'équipe MirAI |
| Requêtes / jour   | 100 000    | 300 000     | 1 000 000   | 10 000 000 | Défini par l'équipe MirAI |

> La capacité système est de 764 req/s (~45 800 req/min).

---

## Comportement en cas de dépassement

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42

{"error": "rate limit exceeded"}
```

`Retry-After` indique le nombre de secondes avant réinitialisation de la fenêtre. Implémenter un backoff exponentiel côté client pour les applications à fort débit.

---

## Demander un accès ou changer de niveau

Pour obtenir un token, monter en niveau ou définir des quotas spécifiques, contacter l'équipe MirAI via le [canal de support](/support/) en précisant le niveau souhaité, les services utilisés et le contexte applicatif.

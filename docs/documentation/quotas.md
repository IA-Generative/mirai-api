# Quotas et niveaux d'accès

Les quotas sont déterminés par le **niveau d'accès** associé à votre token. Quatre niveaux sont disponibles selon le profil d'usage.

---

## Niveaux d'accès

| Niveau          | Profil                                                     | Obtention                             |
| --------------- | ---------------------------------------------------------- | ------------------------------------- |
| **Découverte**  | Utilisateur individuel — tests, scripts, outils personnels | Via MyMirAI *(pas encore disponible)* |
| **Intégration** | Application en phase de développement ou pilote            | Via la SDID                           |
| **Production**  | Application métier standard déployée en production         | Via la SDID                           |
| **Critique**    | Service haute disponibilité ou forte volumétrie            | Via la SDID — défini sur demande      |

Les limites du niveau **Critique** sont définies au cas par cas par la SDID selon les besoins réels de l'application.

---

## Quotas par service

### LLM — `POST /v1/chat/completions`

|                   | Découverte | Intégration | Production | Critique           |
| ----------------- | ---------- | ----------- | ---------- | ------------------ |
| Requêtes / minute | 10         | 30          | 100        | Défini par la SDID |
| Tokens / minute   | 20 000     | 40 000      | 250 000    | Défini par la SDID |
| Tokens / jour     | 500 000    | 1 500 000   | 30 000 000 | Défini par la SDID |

> À titre de référence : `chat-pro` (120B) délivre ~135 tok/s soit ~8 100 tok/min par session.

---

### Audio — Transcription & Diarisation <Badge type="warning" text="Beta" />

Les traitements audio étant longs (jusqu'à ~7 min pour 1 h d'audio), le quota est exprimé en **jobs simultanés** plutôt qu'en requêtes par minute.

|                        | Découverte | Intégration | Production | Critique           |
| ---------------------- | ---------- | ----------- | ---------- | ------------------ |
| Jobs simultanés        | 2          | 4           | 10         | Défini par la SDID |
| Taille max par fichier | 1 Go       | 1 Go        | 1 Go       | 1 Go               |
| Jobs / jour            | 20         | 100         | 500        | Défini par la SDID |

> Le débit global est partagé entre tous les consommateurs. En cas de file d'attente, la position est indiquée dans la réponse polling (`queue_position`).

---

### Embeddings <Badge type="warning" text="Beta" />

|                   | Découverte | Intégration | Production | Critique           |
| ----------------- | ---------- | ----------- | ---------- | ------------------ |
| Requêtes / minute | 100        | 500         | 2 000      | Défini par la SDID |
| Requêtes / jour   | 50 000     | 500 000     | 5 000 000  | Défini par la SDID |

> La capacité système est de 410 req/s (~24 600 req/min).

---

### Reranking <Badge type="warning" text="Beta" />

|                   | Découverte | Intégration | Production | Critique           |
| ----------------- | ---------- | ----------- | ---------- | ------------------ |
| Requêtes / minute | 200        | 1 000       | 4 000      | Défini par la SDID |
| Requêtes / jour   | 100 000    | 1 000 000   | 10 000 000 | Défini par la SDID |

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

Pour obtenir un token, monter en niveau ou définir des quotas spécifiques, contacter la SDID via le [canal de support](/support/) en précisant le niveau souhaité, les services utilisés et le contexte applicatif.

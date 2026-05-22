# Quotas et plans

Les quotas sont déterminés automatiquement à partir du token d'authentification. Deux types de consommateurs sont distingués.

---

## Types de consommateurs

| Type | Description | Token |
|---|---|---|
| **Utilisateur** | Personne physique accédant à l'API directement (tests, scripts, outils internes) | Token opaque Zitadel |
| **Application** | Compte de service intégré dans une application ou un pipeline (production) | Token JWT Zitadel (client ID / secret) / Token opaque Zitadel |

---

## Quotas par service

### LLM — `POST /v1/chat/completions`

| | Utilisateur | Application |
|---|---|---|
| Requêtes / minute | 10 | 100 |
| Tokens / minute | ND | ND |
| Tokens / jour | ND | ND |

> À titre de référence : `chat-smart` (120B) délivre ~135 tok/s soit ~8 100 tok/min par session.

---

### Audio — Transcription & Diarisation <Badge type="warning" text="Beta" />

Les traitements audio étant longs (jusqu'à ~7 min pour 1 h d'audio), le quota est exprimé en **jobs simultanés** plutôt qu'en requêtes par minute.

| | Utilisateur | Application |
|---|---|---|
| Jobs simultanés | 2 | 10 |
| Taille max par fichier | 1G | 1G |
| Jobs / jour | ND | ND |

> Le débit global est partagé entre tous les consommateurs. En cas de file d'attente, la position est indiquée dans la réponse polling (`queue_position`).

---

### Embeddings <Badge type="warning" text="Beta" />

| | Utilisateur | Application |
|---|---|---|
| Requêtes / minute | 100 | 2 000 |
| Requêtes / jour | ND | ND |

> La capacité système est de 410 req/s (~24 600 req/min).

---

### Reranking <Badge type="warning" text="Beta" />

| | Utilisateur | Application |
|---|---|---|
| Requêtes / minute | 200 | 4 000 |
| Requêtes / jour | ND | ND |

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

## Demander un quota supérieur

Pour une Application nécessitant des quotas spécifiques non couverts par les limites par défaut, contacter l'équipe via le [canal de support](/support/).

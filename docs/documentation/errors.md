# Référence des erreurs

Toutes les erreurs retournées par MirAI API's suivent le format JSON suivant :

```json
{
  "error": "description de l'erreur"
}
```

---

## Codes HTTP

### 4xx — Erreurs client

| Code | Nom | Causes fréquentes |
| ---- | --- | ----------------- |
| `400 Bad Request` | Requête invalide | Paramètre manquant ou malformé, format de fichier non supporté, champ `model` absent |
| `401 Unauthorized` | Non authentifié | Token absent, expiré ou malformé — vérifier le header `Authorization: Bearer <TOKEN>` |
| `403 Forbidden` | Accès refusé | Token valide mais sans les droits nécessaires pour ce service |
| `404 Not Found` | Ressource introuvable | Job ID inexistant ou expiré (TTL 72h dépassé) |
| `413 Content Too Large` | Fichier trop volumineux | Fichier audio dépassant 1 Go |
| `415 Unsupported Media Type` | Format non supporté | Format audio non accepté par le modèle |
| `422 Unprocessable Entity` | Contenu non traitable | Fichier audio corrompu ou illisible |
| `429 Too Many Requests` | Quota dépassé | Limite de requêtes par minute atteinte — voir [Quotas](/documentation/quotas) |

### 5xx — Erreurs serveur

| Code | Nom | Causes fréquentes |
| ---- | --- | ----------------- |
| `500 Internal Server Error` | Erreur interne | Erreur inattendue côté inférence — réessayer après quelques secondes |
| `502 Bad Gateway` | Passerelle invalide | Backend d'inférence temporairement indisponible |
| `503 Service Unavailable` | Service indisponible | Maintenance ou surcharge temporaire — réessayer avec backoff exponentiel |

---

## Erreurs de détection PII

Lorsque la gateway détecte des données personnelles dans une requête LLM, elle bloque la requête avant transmission au modèle :

```http
HTTP/1.1 400 Bad Request

{"error": "pii detected: email"}
```

Types détectés : `email`, `phone`, `iban`, `credit_card`, `siren`, `siret`.

---

## Erreur de quota

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42

{"error": "rate limit exceeded"}
```

Le header `Retry-After` indique le nombre de secondes avant réinitialisation de la fenêtre. Implémenter un **backoff exponentiel** côté client pour les applications à fort débit.

---

## États d'un job asynchrone

| Statut | Signification |
| ------ | ------------- |
| `pending` | Job en attente dans la file |
| `processing` | Job en cours de traitement |
| `completed` | Job terminé — résultat disponible |
| `failed` | Erreur lors du traitement — consulter le champ `error` de la réponse |

Exemple de job échoué :

```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "failed",
  "error": "audio file could not be decoded"
}
```

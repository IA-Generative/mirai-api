# Support & Troubleshooting

---

## Contact

Pour toute demande d'accès, question technique ou incident, contacter la **SDID** :

> [À COMPLÉTER — canal Tchap / email / outil de ticketing]

**Demande d'accès :** préciser le type de consommateur (Utilisateur ou Application) et les services souhaités. La SDID crée le compte Zitadel et transmet les credentials. Voir [Authentification](/documentation/authentification).

---

## Erreurs fréquentes

### `401 Unauthorized`

**Cause :** Token absent, expiré ou malformé.

**Vérifier :**
- Que le header `Authorization: Bearer <TOKEN>` est bien présent
- Que le token n'a pas expiré — les tokens ont une **validité de 1 an**, contacter la SDID pour renouvellement
- Que vous n'envoyez pas le mot `Bearer` deux fois

```bash
# Correct
-H "Authorization: Bearer eyJhbGci..."

# Incorrect
-H "Authorization: eyJhbGci..."
-H "Authorization: Bearer Bearer eyJhbGci..."
```

---

### `403 Forbidden`

**Cause :** Token valide mais l'accès au service demandé est refusé.

**Vérifier :**
- Que votre compte dispose bien des droits sur ce service
- Pour les Applications : que le client Zitadel a bien les scopes nécessaires

---

### `429 Too Many Requests`

**Cause :** Quota dépassé.

**Réponse :**

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42

{"error": "rate limit exceeded"}
```

**Action :** Attendre `Retry-After` secondes avant de réessayer. Implémenter un backoff exponentiel pour les appels en boucle. Voir [Quotas et plans](/documentation/quotas) pour les limites de votre type de consommateur.

---

### `413 Request Entity Too Large`

**Cause :** Fichier audio dépassant la taille maximale autorisée pour votre plan.

**Limites :**
- Utilisateur : 100 Mo
- Application : 500 Mo

Compresser le fichier ou utiliser un format plus compact (`.ogg`, `.flac`) avant envoi.

---

### `504 Gateway Timeout` (mode synchrone audio)

**Cause :** Le traitement d'un fichier audio long a dépassé le timeout de connexion côté client.

**Solution :** Utiliser le mode **asynchrone** (`POST /jobs/audio`) pour les fichiers > 30 s. Le timeout de connexion ne s'applique pas aux jobs async. Voir [Modes d'appel](/documentation/modes).

---

### Job async bloqué en `pending`

**Vérifier :**
- La position dans la file (`queue_position`) : si élevée, le système traite d'autres jobs en priorité
- Que le job n'a pas expiré (rétention 24 h)
- Que le fichier soumis était lisible et dans un format supporté

Si le job reste bloqué > 15 min, contacter le support avec le `job_id`.

---

### Résultat non disponible après lecture

**Cause :** Les résultats sont supprimés après leur **première lecture** ou au bout de 24 h.

**Solution :** Stocker le résultat côté application dès réception. Ne pas compter sur une deuxième lecture du même `job_id`.

---

### Latence élevée sur `mistral-medium-albert`

**Cause :** Ce modèle passe par l'API externe Albert/Etalab dont la latence est variable (25–75 tok/s observés selon la charge de l'API nationale).

**Solution :** Utiliser `mistral-small-24b` pour des performances stables et prévisibles, ou `chat-smart` pour un débit maximal.

---

## Vérifier l'état du service

```bash
curl https://gateway.api.ai.numerique-interieur.com/health
# → {"status": "ok"}
```

---

## Tester rapidement l'authentification

```bash
curl https://gateway.api.ai.numerique-interieur.com/v1/models \
  -H "Authorization: Bearer <TOKEN>"
```

Une réponse `200` avec la liste des modèles confirme que le token est valide et l'accès opérationnel.

# Support & Troubleshooting

---

## Contact

Pour toute demande d'accès, question technique ou incident, contacter l'**équipe MirAI** :

> **Email :** [service-team-sdid@interieur.gouv.fr](mailto:service-team-sdid@interieur.gouv.fr)

**Accès applicatif :** préciser les services souhaités et l'usage applicatif. L'équipe MirAI crée le compte Zitadel et transmet le token. Voir [Authentification](/documentation/authentification).

> **Accès utilisateur individuel :** les tokens individuels seront délivrés via **MyMirAI** — pas encore disponible. Aucun accès manuel n'est possible en attendant.

---

## Erreurs fréquentes

### `401 Unauthorized`

**Cause :** Token absent, expiré ou malformé.

**Vérifier :**
- Que le header `Authorization: Bearer <TOKEN>` est bien présent
- Que le token n'a pas expiré — les tokens ont une **validité de 1 an**, contacter l'équipe MirAI pour renouvellement
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
- Pour les applications : que le client Zitadel a bien les scopes nécessaires

---

### `429 Too Many Requests`

**Cause :** Quota dépassé.

**Réponse :**

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42

{"error": "rate limit exceeded"}
```

**Action :** Attendre `Retry-After` secondes avant de réessayer. Implémenter un backoff exponentiel pour les appels en boucle. Voir [Quotas et niveaux d'accès](/documentation/quotas).

---

### `413 Content Too Large`

**Cause :** Fichier audio dépassant la taille maximale autorisée.

**Limite :** 1 Go par fichier, tous niveaux confondus.

Compresser le fichier ou utiliser un format plus compact (`.ogg`, `.flac`) avant envoi.

---

### `504 Gateway Timeout` (mode synchrone audio)

**Cause :** Le traitement d'un fichier audio long a dépassé le timeout de connexion côté client.

**Solution :** Utiliser le mode **asynchrone** (`POST /jobs/audio`) pour les fichiers longs. Le timeout de connexion ne s'applique pas aux jobs async. Voir [Modes d'appel](/documentation/modes).

---

### Job async bloqué en `pending`

**Vérifier :**
- La position dans la file (`queue_position`) : si élevée, le système traite d'autres jobs en priorité
- Que le job n'a pas expiré (rétention 72 h)
- Que le fichier soumis était lisible et dans un format supporté

Si le job reste bloqué plus de 15 min, contacter l'équipe MirAI avec le `job_id`.

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

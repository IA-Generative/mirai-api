# Authentification

L'accès à MirAI API's est sécurisé via **Zitadel**. Chaque consommateur — Utilisateur ou Application — reçoit un **token opaque** valable **1 an**.

---

## Token

Le token est fourni par la SDID lors de l'ouverture d'accès. Il est identique pour les deux types de consommateurs :

| Type | Usage | Quotas |
|---|---|---|
| **Utilisateur** | Personne physique — tests, scripts, outils internes | Voir [Quotas](/documentation/quotas#utilisateur) |
| **Application** | Compte de service intégré dans un pipeline ou une application | Voir [Quotas](/documentation/quotas#application) |

**Durée de validité : 1 an.** À l'approche de l'expiration, contacter la SDID pour renouveler le token avant interruption de service.

---

## Obtenir un accès

L'accès à MirAI API's n'est pas en libre-service. Pour obtenir un token :

1. Contacter la **SDID** via le [canal de support](/support/)
2. Préciser le type de consommateur (**Utilisateur** ou **Application**) et le ou les services souhaités
3. La SDID crée le compte Zitadel et transmet le token

---

## Utiliser le token

Le token est transmis dans le header `Authorization` de chaque requête :

```
Authorization: Bearer <TOKEN>
```

### Exemple curl

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/chat/completions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"model": "chat-smart", "messages": [{"role": "user", "content": "Bonjour"}]}'
```

### Exemple SDK OpenAI (Python)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"   # token Zitadel ici
)
```

---

## Erreurs d'authentification

| Code | Signification | Action |
|---|---|---|
| `401 Unauthorized` | Token absent, expiré ou malformé | Vérifier le header `Authorization: Bearer <TOKEN>` et la date d'expiration du token (validité 1 an) |
| `403 Forbidden` | Token valide mais accès refusé | Vérifier que le token dispose des droits nécessaires |
| `429 Too Many Requests` | Quota dépassé | Voir [Quotas et plans](/documentation/quotas) |

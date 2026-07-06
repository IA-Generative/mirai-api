# Authentification

L'accès à MirAI API's est sécurisé via [Zitadel](https://zitadel.com/docs). Chaque consommateur reçoit un **token opaque** valable **1 an**, associé à un niveau d'accès qui détermine ses quotas.

---

## Token

Chaque token est associé à un **niveau d'accès** (Découverte, Développeur, Intégration, Production, Critique) qui détermine les quotas applicables. Voir [Quotas et niveaux d'accès](/documentation/quotas) pour le détail des limites par niveau et les modalités d'obtention.

**Durée de validité : 1 an.** À l'approche de l'expiration, renouveler le token avant interruption de service via le même canal d'obtention.

---

## Obtenir un accès

### Niveaux Découverte et Développeur

Les tokens individuels (**Découverte** et **Développeur**) sont délivrés via l'application **MyMirAI** — **pas encore disponible**. L'ouverture des accès individuels sera annoncée lors du lancement de MyMirAI.

### Niveaux Intégration, Production et Critique

L'accès applicatif n'est pas en libre-service :

1. Contacter l'**équipe MirAI** via le [canal de support](/support/)
2. Préciser le niveau souhaité, les services utilisés et le contexte applicatif
3. L'équipe MirAI crée le compte Zitadel et transmet le token

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
  -d '{"model": "chat-pro", "messages": [{"role": "user", "content": "Bonjour"}]}'
```

### Exemple SDK OpenAI (Python)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"
)
```

---

## Erreurs d'authentification

| Code                    | Signification                    | Action                                                                                     |
| ----------------------- | -------------------------------- | ------------------------------------------------------------------------------------------ |
| `401 Unauthorized`      | Token absent, expiré ou malformé | Vérifier le header `Authorization: Bearer <TOKEN>` et la date d'expiration (validité 1 an) |
| `403 Forbidden`         | Token valide mais accès refusé   | Vérifier que le token dispose des droits nécessaires                                       |
| `429 Too Many Requests` | Quota dépassé                    | Voir [Quotas et niveaux d'accès](/documentation/quotas)                                    |

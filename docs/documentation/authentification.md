# Authentification

L'accès à MirAI API's est sécurisé par un **token opaque**, associé à un niveau d'accès qui détermine ses quotas.

---

## Token {#token}

Chaque token est associé à un **niveau d'accès** (Découverte, Développeur, Intégration, Production, Critique) qui détermine les quotas applicables. Voir [Quotas et niveaux d'accès](/documentation/quotas) pour le détail des limites par niveau et les modalités d'obtention.

**Durée de validité :**
- **Découverte / Développeur** — jusqu'à 90 jours, choisie librement à la création du token sur le portail.
- **Intégration / Production / Critique** — jusqu'à 1 an, fixée par l'équipe MirAI à la création.

À l'approche de l'expiration, renouveler le token avant interruption de service via le même canal d'obtention.

---

## Obtenir un accès

### Niveau Découverte

Libre-service, sans demande préalable : connectez-vous sur le [portail d'accès](https://acces.api.ai.numerique-interieur.com) et créez votre token — il s'affiche une seule fois, à copier immédiatement.

### Niveau Développeur

1. Demander l'accès auprès de l'équipe MirAI via l'[email d'accompagnement](/support/#contact)
2. Une fois l'accès accordé, créer le token en libre-service sur le [portail d'accès](https://acces.api.ai.numerique-interieur.com), comme pour le niveau Découverte

### Niveaux Intégration, Production et Critique

L'accès applicatif n'est pas en libre-service :

1. Contacter l'**équipe MirAI** via le [canal de support](/support/)
2. Préciser le niveau souhaité, les services utilisés et le contexte applicatif
3. L'équipe MirAI crée le compte et vous transmet un lien à usage unique : ouvrez-le et confirmez pour générer votre token

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
| `401 Unauthorized`      | Token absent, expiré ou malformé | Vérifier le header `Authorization: Bearer <TOKEN>` et la [date d'expiration](#token)        |
| `403 Forbidden`         | Token valide mais accès refusé   | Vérifier que le token dispose des droits nécessaires                                       |
| `429 Too Many Requests` | Quota dépassé                    | Voir [Quotas et niveaux d'accès](/documentation/quotas)                                    |

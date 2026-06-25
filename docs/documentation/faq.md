# FAQ

---

## Authentification

### Mon token a expiré, que faire ?

Les tokens sont valables **1 an**. Contacter l'équipe MirAI via le [canal de support](/support/) pour le renouveler.

### Puis-je utiliser le SDK OpenAI officiel ?

Oui. Il suffit de changer le `base_url` :

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"
)
```

Aucune autre modification n'est nécessaire pour les endpoints LLM, audio et embeddings.

---

## LLM

### Quel modèle choisir ?

| Besoin | Modèle recommandé |
| ------ | ----------------- |
| Synthèse, analyse, raisonnement complexe | `chat-pro` |
| Function calling, agents (haute qualité) | `tools-pro` |
| Function calling, agents (faible latence) | `tools` |
| Interaction rapide, faible latence | `chat` |
| Génération ou revue de code | `code` ou `code-completion` |
| Accès au modèle Albert/Etalab | `mistral-medium-albert` |

### Le streaming est-il supporté ?

Oui, via le paramètre `stream: true` sur l'endpoint `/v1/chat/completions`.

### Ma requête est bloquée avec une erreur PII, que faire ?

La gateway détecte et bloque les requêtes contenant des données personnelles (e-mail, téléphone, IBAN, carte bancaire, SIREN/SIRET). Anonymiser les données avant de les envoyer au modèle.

---

## Audio

### Quels formats audio sont acceptés ?

Les formats courants sont supportés : `mp3`, `wav`, `ogg`, `flac`, `m4a`, `webm`. Taille maximale : **1 Go**.

### La transcription supporte-t-elle plusieurs langues ?

Oui, faster-whisper détecte automatiquement la langue de l'audio et transcrit dans cette langue. Pour forcer une langue, utiliser le paramètre `language`.

### La traduction peut-elle produire un résultat dans une autre langue que l'anglais ?

Non. L'endpoint `/v1/audio/translations` produit uniquement du texte en **anglais** — c'est une contrainte du modèle Whisper. Pour traduire vers une autre langue, combiner la transcription avec un appel LLM.

### Quel mode choisir pour l'audio — synchrone ou asynchrone ?

- **Synchrone** (`/v1/audio/transcriptions`) : adapté aux fichiers courts (< 5 min), la connexion reste ouverte pendant le traitement
- **Asynchrone** (`/jobs/audio`) : recommandé pour les fichiers longs ou les traitements en batch, libère la connexion immédiatement

---

## Jobs asynchrones

### Combien de temps un job est-il conservé ?

Les jobs et leurs résultats sont conservés **72 heures**. Au-delà, le job n'est plus accessible.

### Que se passe-t-il si mon webhook échoue ?

La gateway effectue **3 tentatives** avec backoff exponentiel (2 s → 4 s → 8 s). Les tentatives s'appliquent aux erreurs réseau et aux réponses HTTP 5xx — une réponse 4xx est considérée comme une livraison réussie. En cas d'échec définitif, contacter l'équipe MirAI via le [canal de support](/support/).

### Comment connaître ma position dans la file d'attente ?

La réponse au polling inclut le champ `queue_position` lorsque le job est en statut `pending`. La valeur est calculée en temps réel depuis la file Redis :

```json
{ "status": "pending", "queue_position": 3 }
```

---

## Quotas

### Comment savoir quel est mon niveau d'accès ?

Le niveau est lié au token. En cas de doute, contacter l'équipe MirAI via le [canal de support](/support/).

### Que se passe-t-il quand je dépasse mon quota ?

La gateway retourne un `429 Too Many Requests` avec un header `Retry-After` indiquant le nombre de secondes avant réinitialisation. Voir [Quotas](/documentation/quotas#comportement-en-cas-de-dépassement).

### Comment obtenir un niveau supérieur ?

Contacter l'équipe MirAI via le [canal de support](/support/) en précisant le niveau souhaité, les services utilisés et le contexte applicatif.

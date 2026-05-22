# Transcription & Traduction audio <Badge type="warning" text="Beta" />

Convertit des fichiers audio en texte (transcription) ou traduit leur contenu en anglais (traduction), via le modèle `faster-whisper-large-v3-turbo`.

---

## Endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/v1/audio/transcriptions` | Transcription synchrone |
| `POST` | `/v1/audio/translations` | Traduction vers l'anglais (synchrone) |
| `POST` | `/jobs/audio` | Transcription/traduction asynchrone |

---

## Formats et limites

| Attribut | Valeur |
|---|---|
| Formats acceptés | `.mp3` `.wav` `.m4a` `.ogg` `.flac` |
| Taille maximale | 500 Mo |
| Compatibilité SDK | OpenAI (`client.audio.transcriptions.create`) |

---

## Performances mesurées

Benchmarks réalisés en mai 2026 sur 27 jobs, modèle chaud.

### Fichiers courts (≈ 105 s d'audio)

| Mode de livraison | Jobs | Inférence min | Inférence moy | Inférence max | RTF moyen |
|---|---|---|---|---|---|
| Poll | 13 | 5 s | 7 s | 12 s | 0.065 |
| Webhook | 14 | 5 s | 6 s | 7 s | 0.056 |

### Fichiers longs (1 heure d'audio)

| Mode de livraison | Jobs | Inférence min | Inférence moy | Inférence max | RTF moyen |
|---|---|---|---|---|---|
| Poll | 5 | 175 s | **213 s** | 349 s | 0.065 |
| Webhook | 5 | 165 s | **192 s** | 248 s | 0.053 |

> **RTF (Real-Time Factor)** : rapport entre la durée de traitement et la durée de l'audio. RTF 0.06 = 1 heure d'audio traitée en ~3 min 30 s.

Le modèle bénéficie du batching interne des frames audio : le RTF sur fichiers longs (~0.06) est **10× meilleur** que sur fichiers très courts (~0.67).

**Taux d'erreur : 0% sur 27 jobs.**

---

## Exemple d'utilisation

### SDK OpenAI (Python)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"
)

with open("interview.wav", "rb") as f:
    result = client.audio.transcriptions.create(
        model="faster-whisper-large-v3-turbo",
        file=f,
    )
print(result.text)
```

### curl

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/audio/transcriptions \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@interview.wav"
```

### Async (fichiers longs recommandé)

Pour les fichiers > 30 s, privilégier le mode asynchrone :

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/jobs/audio \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@conference.mp3" \
  -F "callback_url=https://mon-app.example.com/hooks/transcription"
```

→ Voir [Modes synchrone et asynchrone](/documentation/modes) pour le détail du cycle de vie d'un job.

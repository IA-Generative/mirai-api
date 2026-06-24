# Transcription & Traduction audio <Badge type="warning" text="Beta" />

Convertit des fichiers audio en texte (transcription) ou traduit leur contenu en anglais (traduction), via le modèle `faster-whisper-large-v3-turbo`.

---

## Endpoints

| Méthode | Endpoint | Mode | Description |
|---|---|---|---|
| `POST` | `/v1/audio/transcriptions` | Sync | Transcription, résultat inline |
| `POST` | `/v1/audio/translations` | Sync | Traduction vers l'anglais, résultat inline |
| `POST` | `/jobs/audio` | Async | Transcription/traduction asynchrone |

---

## Formats et limites

| Attribut | Valeur |
|---|---|
| Formats acceptés | `.mp3` `.mp4` `.wav` `.m4a` `.ogg` `.flac` |
| Taille maximale | 1 Go |
| Compatibilité SDK | OpenAI (`client.audio.transcriptions.create`) |

---

## Paramètres

### Requis

| Paramètre | Type | Description |
|---|---|---|
| `file` | fichier | Fichier audio à transcrire |

### Optionnels utiles

| Paramètre | Défaut | Description |
|---|---|---|
| `language` | auto-détecté | Code ISO-639-1 (ex: `fr`, `en`). Forcer la langue accélère le traitement. |
| `response_format` | `json` | Format de sortie : `json`, `verbose_json`, `text`, `srt`, `vtt` |
| `timestamp_granularities` | `["segment"]` | Granularité des timestamps : `segment` et/ou `word` |
| `word_timestamps` | `false` | Active les timestamps au niveau du mot |
| `vad_filter` | `false` | Active le filtre Voice Activity Detection (silence ignoré) |
| `hotwords` | — | Mots à favoriser lors du décodage (virgule-séparés) |
| `prompt` | — | Contexte textuel pour guider le style ou les termes spécifiques |

---

## Performances mesurées

Benchmarks réalisés en mai 2026 sur 27 jobs, modèle chaud.

### Fichiers courts (≈ 105 s d'audio)

| Mode | Jobs | Inférence min | Inférence moy | Inférence max | RTF moyen |
|---|---|---|---|---|---|
| Poll | 13 | 5 s | 7 s | 12 s | 0.065 |
| Webhook | 14 | 5 s | 6 s | 7 s | 0.056 |

### Fichiers longs (1 heure d'audio)

| Mode | Jobs | Inférence min | Inférence moy | Inférence max | RTF moyen |
|---|---|---|---|---|---|
| Poll | 5 | 175 s | **213 s** | 349 s | 0.065 |
| Webhook | 5 | 165 s | **192 s** | 248 s | 0.053 |

> **RTF (Real-Time Factor)** : RTF 0.06 = 1 heure d'audio traitée en ~3 min 30 s. Le modèle est **10× plus rapide** sur audio long que sur fichiers courts grâce au batching interne des frames.

**Taux d'erreur : 0% sur 27 jobs.**

---

## Exemples

### Transcription simple (curl)

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/audio/transcriptions \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@interview.wav"
# → {"text": "Bonjour, bienvenue..."}
```

### Avec langue forcée et timestamps par mot

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/audio/transcriptions \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@interview.wav" \
  -F "language=fr" \
  -F "word_timestamps=true" \
  -F "response_format=verbose_json"
```

### Format SRT (sous-titres)

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/audio/transcriptions \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@conference.mp4" \
  -F "response_format=srt"
```

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
        language="fr",
        response_format="verbose_json",
        timestamp_granularities=["word"],
    )

print(result.text)
for word in result.words:
    print(f"{word.start:.2f}s  {word.word}")
```

### Traduction vers l'anglais

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/audio/translations \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@discours_fr.mp3"
# → {"text": "Good morning, welcome..."}
```

### Async (batch / fichiers volumineux)

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/jobs/audio \
  -H "Authorization: Bearer <TOKEN>" \
  -F "model=faster-whisper-large-v3-turbo" \
  -F "operation=transcription" \
  -F "file=@conference.mp3" \
  -F "callback_url=https://mon-app.example.com/hooks/transcription"
```

→ Voir [Modes d'appel](/documentation/modes) pour le cycle de vie complet d'un job async.

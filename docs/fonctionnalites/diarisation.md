# Diarisation audio <Badge type="warning" text="Beta" />

Identifie et segmente les tours de parole dans un fichier audio : qui parle, et à quel moment. Basé sur le modèle `pyannote-diarization`.

---

## Endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/v1/audio/diarizations` | Diarisation synchrone |
| `POST` | `/v1/diarize` | Alias synchrone |
| `POST` | `/jobs/audio` | Diarisation asynchrone (recommandé) |

Pour le mode async, passer `model=pyannote-diarization` dans le corps de la requête.

---

## Formats et limites

| Attribut | Valeur |
|---|---|
| Formats acceptés | `.mp3` `.wav` `.m4a` `.ogg` `.flac` |
| Taille maximale | 500 Mo |

---

## Performances mesurées

Benchmarks réalisés en mai 2026 sur 40 jobs complétés. **Taux d'erreur : 0% sur 40 jobs.**

### Fichiers courts (≈ 105 s d'audio)

| Mode de livraison | Jobs | Inférence min | Inférence moy | Inférence max | RTF moyen |
|---|---|---|---|---|---|
| Poll | 15 | 8 s | 14 s | 28 s | 0.129 |
| Webhook | 15 | 11 s | 21 s | 40 s | 0.197 |

> Le RTF sur fichiers courts est plus élevé en raison de l'overhead fixe du pipeline pyannote (segmentation + embedding), proportionnellement plus lourd sur des fichiers courts.

### Fichiers longs (1 heure d'audio)

| Mode de livraison | Jobs | Inférence min | Inférence moy | Inférence max | RTF moyen |
|---|---|---|---|---|---|
| Poll | 5 | 345 s | **427 s** | 556 s | 0.119 |
| Webhook | 5 | 245 s | **326 s** | 420 s | 0.091 |

> Une heure d'audio est diarisée en **5 min 26 s** (webhook) à **7 min 07 s** (poll) en moyenne — RTF bien inférieur au temps réel.

---

## Format de réponse

```json
{
  "speakers": [
    {
      "speaker": "SPEAKER_00",
      "segments": [
        { "start": 0.5, "end": 4.2 },
        { "start": 12.1, "end": 18.7 }
      ]
    },
    {
      "speaker": "SPEAKER_01",
      "segments": [
        { "start": 4.5, "end": 11.8 }
      ]
    }
  ]
}
```

---

## Exemple d'utilisation

### Synchrone (curl)

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/audio/diarizations \
  -H "Authorization: Bearer <TOKEN>" \
  -F "model=pyannote-diarization" \
  -F "file=@reunion.wav"
```

### Asynchrone avec webhook (recommandé pour fichiers > 30 s)

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/jobs/audio \
  -H "Authorization: Bearer <TOKEN>" \
  -F "model=pyannote-diarization" \
  -F "file=@conference.mp3" \
  -F "callback_url=https://mon-app.example.com/hooks/diarization"
```

→ Voir [Modes synchrone et asynchrone](/documentation/modes) pour le cycle de vie complet d'un job async.

---

## Combinaison transcription + diarisation

La diarisation retourne des segments temporels par locuteur. Pour obtenir un transcript enrichi avec les locuteurs, combinez la sortie de diarisation avec une transcription Whisper en alignant les timestamps côté application.

> Ce découpage est intentionnel : chaque service reste autonome et optimisé. L'alignement est plus fiable fait par l'application consommatrice, qui connaît le contexte métier.

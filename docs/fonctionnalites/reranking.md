# Reranking <Badge type="warning" text="Beta" />

Réordonne une liste de passages en fonction de leur pertinence par rapport à une requête. Utilisé pour améliorer la précision des pipelines RAG en filtrant et reclassant les chunks récupérés par une recherche vectorielle.

**Endpoints :** `POST /v1/rerank` · `POST /rerank`

---

## Performances mesurées

Benchmark de charge réalisé en mai 2026 (50 VUs simultanés, ~24 min).

| Métrique       | Valeur        |
| -------------- | ------------- |
| Débit moyen    | **764 req/s** |
| Débit max      | 833 req/s     |
| Latence p95    | **855 ms**    |
| Latence p99    | **946 ms**    |
| Total requêtes | 907 690       |
| Taux d'erreur  | **0%**        |

> Comportement très stable : latence p95 et p99 inférieures à 1 s sur l'ensemble du test. Pics ponctuels à ~2 s lors des montées en charge, se résorbant rapidement.

---

## Format de requête

```json
{
  "model": "bge-reranker-v2-m3",
  "query": "Comment fonctionne la diarisation audio ?",
  "texts": [
    "La diarisation est le processus qui consiste à segmenter un audio par locuteur.",
    "Le modèle pyannote utilise des embeddings de locuteurs pour identifier les tours de parole.",
    "La transcription convertit la parole en texte sans identifier les locuteurs.",
    "Le reranking est utilisé pour améliorer la pertinence des résultats de recherche."
  ],
  "return_text": true,
  "raw_scores": false
}
```

## Format de réponse

La réponse est un tableau trié par score décroissant. Le champ `text` n'est présent que si `return_text: true`.

```json
[
  { "index": 0, "score": 0.98, "text": "La diarisation est le processus..." },
  { "index": 1, "score": 0.91, "text": "Le modèle pyannote utilise..." },
  { "index": 3, "score": 0.12, "text": "Le reranking est utilisé..." }
]
```

---

## Exemple d'utilisation

### Python

```python
import httpx

response = httpx.post(
    "https://gateway.api.ai.numerique-interieur.com/v1/rerank",
    headers={"Authorization": "Bearer <TOKEN>"},
    json={
        "model": "bge-reranker-v2-m3",
        "query": "Quelles sont les obligations du fonctionnaire ?",
        "texts": chunks,  # liste de strings issues de votre index vectoriel
        "return_text": True,
    }
)

ranked = response.json()  # tableau trié par score décroissant
top_chunks = [r["text"] for r in ranked]
```

### curl

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/rerank \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bge-reranker-v2-m3",
    "query": "obligations du fonctionnaire",
    "texts": ["doc1", "doc2", "doc3"],
    "return_text": true
  }'
```

---

## Cas d'usage

Le reranking s'insère typiquement **après** une recherche vectorielle grossière :

```
Requête utilisateur
      ↓
Recherche vectorielle (bge-m3 embeddings) → top 20 chunks
      ↓
Reranking (bge-reranker-v2-m3) → top 5 chunks les plus pertinents
      ↓
Injection dans le LLM (chat-pro)
      ↓
Réponse finale
```

Cette approche en deux étapes permet de combiner la vitesse de la recherche vectorielle avec la précision d'un modèle de pertinence cross-encoder.

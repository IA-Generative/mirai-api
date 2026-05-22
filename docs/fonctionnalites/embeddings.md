# Embeddings <Badge type="warning" text="Beta" />

Génère des représentations vectorielles (embeddings) de texte pour la recherche sémantique, la similarité de documents et les pipelines RAG. Basé sur le modèle `bge-m3`.

**Endpoint :** `POST /v1/embeddings`

---

## Performances mesurées

Benchmark de charge réalisé en mai 2026 (73 VUs simultanés, ~20 min).

| Métrique | Valeur |
|---|---|
| Débit moyen | **410 req/s** |
| Débit max | 645 req/s |
| Latence p95 | 1.03 s |
| Latence p99 | 1.78 s |
| Total requêtes | 464 528 |
| Taux d'erreur | **0%** |

> La latence augmente progressivement sous très haute concurrence (p99 > 4 s au-delà de ~500 VUs simultanés). Pour des usages à fort débit, prévoir une gestion du backpressure côté client.

---

## Exemple d'utilisation

### SDK OpenAI (Python)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"
)

response = client.embeddings.create(
    model="bge-m3",
    input="Texte à vectoriser pour la recherche sémantique"
)

vector = response.data[0].embedding
print(f"Dimension : {len(vector)}")  # 1024
```

### Batch (liste de textes)

```python
response = client.embeddings.create(
    model="bge-m3",
    input=[
        "Premier document à indexer",
        "Deuxième document à indexer",
        "Troisième document à indexer",
    ]
)

vectors = [item.embedding for item in response.data]
```

### curl

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/v1/embeddings \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"model": "bge-m3", "input": "Texte à vectoriser"}'
```

---

## Cas d'usage

- **Recherche sémantique** : indexer des documents et retrouver les plus pertinents par rapport à une requête utilisateur
- **Deduplication** : détecter des documents quasi-identiques à grande échelle
- **Pipeline RAG** : générer les embeddings des chunks de contexte avant injection dans un LLM
- **Clustering** : regrouper des documents par thématique sans supervision

---

## Dimension des vecteurs

Le modèle `bge-m3` produit des vecteurs de **1024 dimensions**, compatibles avec les bases vectorielles standard (pgvector, Qdrant, Weaviate, Chroma…).

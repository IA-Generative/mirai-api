# Exemples d'intégration

Exemples complets pour chaque service, en Python (SDK OpenAI), JavaScript et curl.

---

## Chat LLM

### Python — réponse complète

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"
)

response = client.chat.completions.create(
    model="chat-smart",
    messages=[
        {"role": "system", "content": "Tu es un assistant expert en droit administratif français."},
        {"role": "user", "content": "Quelles sont les obligations de neutralité d'un fonctionnaire ?"}
    ]
)
print(response.choices[0].message.content)
```

### Python — streaming

```python
stream = client.chat.completions.create(
    model="chat-small",
    messages=[{"role": "user", "content": "Résume ce texte en 3 points : ..."}],
    stream=True,
)
for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
```

### JavaScript

```js
const response = await client.chat.completions.create({
  model: 'tools',
  messages: [{ role: 'user', content: 'Bonjour' }],
})
console.log(response.choices[0].message.content)
```

---

## Transcription audio

### Python

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

### JavaScript

```js
import fs from 'node:fs'
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://gateway.api.ai.numerique-interieur.com',
  apiKey: '<TOKEN>',
})

const result = await client.audio.transcriptions.create({
  model: 'faster-whisper-large-v3-turbo',
  file: fs.createReadStream('interview.wav'),
})
console.log(result.text)
```

---

## Diarisation audio (async + webhook)

```bash
curl -X POST https://gateway.api.ai.numerique-interieur.com/jobs/audio \
  -H "Authorization: Bearer <TOKEN>" \
  -F "model=pyannote-diarization" \
  -F "file=@reunion.wav" \
  -F "callback_url=https://mon-app.example.com/hooks/diarization"
```

---

## Embeddings

### Python — vecteur unique

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
vector = response.data[0].embedding  # liste de 1024 floats
```

### Python — batch

```python
texts = ["Document 1", "Document 2", "Document 3"]
response = client.embeddings.create(model="bge-m3", input=texts)
vectors = [item.embedding for item in response.data]
```

---

## Reranking

### Python

```python
import httpx

response = httpx.post(
    "https://gateway.api.ai.numerique-interieur.com/v1/rerank",
    headers={"Authorization": "Bearer <TOKEN>"},
    json={
        "model": "bge-reranker-v2-m3",
        "query": "obligations du fonctionnaire territorial",
        "documents": [
            "Le fonctionnaire est soumis au principe de neutralité...",
            "Les congés annuels sont fixés par décret...",
            "L'obligation de réserve s'applique en dehors du service...",
        ],
        "top_n": 2,
    }
)
results = response.json()["results"]
```

---

## Pipeline RAG complet

Exemple bout-en-bout : embeddings → recherche vectorielle → reranking → LLM.

```python
from openai import OpenAI
import httpx

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"
)

question = "Quelles sont les obligations de neutralité d'un fonctionnaire ?"

# 1. Embeddings de la question
q_vec = client.embeddings.create(model="bge-m3", input=question).data[0].embedding

# 2. Recherche vectorielle (exemple avec votre base vectorielle)
# chunks = your_vector_db.search(q_vec, top_k=20)

# 3. Reranking
reranked = httpx.post(
    "https://gateway.api.ai.numerique-interieur.com/v1/rerank",
    headers={"Authorization": "Bearer <TOKEN>"},
    json={
        "model": "bge-reranker-v2-m3",
        "query": question,
        "documents": chunks,
        "top_n": 5,
    }
).json()["results"]

context = "\n\n".join(r["document"] for r in reranked)

# 4. Génération
response = client.chat.completions.create(
    model="chat-smart",
    messages=[
        {"role": "system", "content": f"Réponds uniquement à partir du contexte suivant :\n\n{context}"},
        {"role": "user", "content": question},
    ]
)
print(response.choices[0].message.content)
```

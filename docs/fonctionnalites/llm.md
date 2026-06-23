# LLM — Génération de texte

Accès à 8 modèles de génération de texte via une interface 100% compatible OpenAI. Du modèle léger et rapide au modèle 120B paramètres pour les tâches complexes.

**Endpoint :** `POST /v1/chat/completions`

---

## Catalogue des modèles

| Alias                   | Modèle                              | Paramètres | tok/s | Latence moy | Usage recommandé                     |
| ----------------------- | ----------------------------------- | ---------- | ----- | ----------- | ------------------------------------ |
| `chat-pro`              | gpt-oss-120b                        | 120B       | 117.6 | 1.38 s      | Réponses riches, synthèse, analyse   |
| `tools`                 | gpt-oss-120b                        | 120B       | 124.4 | 1.03 s      | Function calling, agents             |
| `code`                  | gpt-oss-120b                        | 120B       | 130.4 | 1.15 s      | Génération et revue de code          |
| `chat-small`            | gemma-4-26B-A4B-it                  | 26B        | 104.0 | 1.05 s      | Interactions rapides, faible latence |
| `tools-fast`            | gemma-4-26B-A4B-it                  | 26B        | 107.8 | 0.95 s      | Agents à faible latence              |
| `code-completion`       | Qwen3-Coder-30B-A3B                 | 30B        | 105.7 | 1.04 s      | Complétion de code, copilot          |
| `mistral-medium-albert` | mistral-medium-2508 (Albert/Etalab) | —          | —     | —           | Modèle souverain via API nationale   |

> Benchmarks réalisés en mai 2026 avec des prompts de 81–95 tokens.

---

## Benchmark détaillé — `gpt-oss-120b`

| Taille réponse | Tokens prompt | Tokens réponse | Latence moy | Latence min | Latence max | tok/s     |
| -------------- | ------------- | -------------- | ----------- | ----------- | ----------- | --------- |
| Courte         | ~81           | ~68            | 0.67 s      | 0.62 s      | 0.70 s      | 100.7     |
| Moyenne        | ~87           | ~297           | 2.20 s      | 1.99 s      | 2.51 s      | 135.2     |
| Longue         | ~95           | ~395           | 2.88 s      | 2.71 s      | 3.13 s      | **137.5** |

- Débit stable à **125–140 tok/s** en régime établi.
- Latence p99 < 3.2 s pour des réponses jusqu'à 400 tokens.
- Le cache de réponse ramène la latence à **~0.1 s** sur requêtes identiques (gain ×7–30×) — particulièrement utile pour les prompts système répétitifs.

---

## Streaming

Le streaming est supporté sur tous les modèles :

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"
)

stream = client.chat.completions.create(
    model="chat-pro",
    messages=[{"role": "user", "content": "Explique la diarisation audio en 3 points."}],
    stream=True,
)

for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
```

---

## Choisir le bon modèle

```
Tâche complexe, synthèse longue, raisonnement    →  chat-pro
Function calling / agents                        →  tools ou tools-fast
Génération ou revue de code                      →  code ou code-completion
Interaction temps réel, faible latence           →  chat-small ou tools-fast
```

> `mistral-medium-albert` passe par l'API externe Albert/Etalab — sa latence est variable selon la charge de l'API.
>

---

## Exemple d'intégration

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"
)

response = client.chat.completions.create(
    model="chat-pro",
    messages=[
        {"role": "system", "content": "Tu es un assistant expert en droit administratif français."},
        {"role": "user", "content": "Résume ce document en 5 points clés : ..."}
    ]
)
print(response.choices[0].message.content)
```

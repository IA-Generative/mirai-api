# LLM — Génération de texte

Accès à plusieurs modèles de génération de texte via une interface 100% compatible OpenAI. Du modèle léger et rapide au modèle 120B paramètres pour les tâches complexes. Pour la compréhension d'images, voir [Vision](/fonctionnalites/vision) ; la génération d'images arrive bientôt, voir [Génération d'images](/fonctionnalites/generation).

Chaque modèle possède un **alias flottant** (`chat`, `code`, …) et un **nom figé versionné** (`chat-1.0`, `code-1.0`, …) ; privilégiez le nom figé en production. Voir [Versionnage des modèles](/documentation/versionnage-modeles).

**Endpoint :** `POST /v1/chat/completions`

---

## Catalogue des modèles

| Alias                   | Modèle                              | Paramètres | tok/s | Latence moy | Usage recommandé                     |
| ----------------------- | ----------------------------------- | ---------- | ----- | ----------- | ------------------------------------ |
| `chat-pro`              | gpt-oss-120b                        | 120B       | 117.6 | 1.38 s      | Réponses riches, synthèse, analyse   |
| `tools-pro`             | gpt-oss-120b                        | 120B       | 124.4 | 1.03 s      | Function calling, agents (120B)      |
| `chat`                  | gemma-4-26B-A4B-it                  | 26B        | 104.0 | 1.05 s      | Interactions rapides, faible latence |
| `tools`                 | gemma-4-26B-A4B-it                  | 26B        | 107.8 | 0.95 s      | Function calling, agents (rapide)    |
| `code`                  | Qwen3.6-35B-A3B                     | 35B        | —     | —           | Génération et revue de code          |
| `code-completion`       | Qwen3.6-35B-A3B                     | 35B        | —     | —           | Complétion de code, copilot          |
| `code-1.0`              | Qwen3.8-27B                         | 27B        | —     | —           | Génération et revue de code (nouveau moteur) |
| `code-completion-1.0`   | Qwen3.8-27B                         | 27B        | —     | —           | Complétion de code, copilot (nouveau moteur) |
| `code-next`             | Qwen3.8-27B                         | 27B        | —     | —           | ⚠️ Déprécié — migrer vers `code-1.0` |
| `code-completion-next`  | Qwen3.8-27B                         | 27B        | —     | —           | ⚠️ Déprécié — migrer vers `code-completion-1.0` |

> Benchmarks réalisés en mai 2026 avec des prompts de 81–95 tokens.

> **`code-next` et `code-completion-next` sont dépréciés.** C'étaient des aperçus de Qwen3.8-27B, désormais remplacés par les noms figés `code-1.0` et `code-completion-1.0` (même moteur). Ils seront **retirés le 30 novembre 2026** — migrez avant cette date. Détails : [Versionnage des modèles](/documentation/versionnage-modeles).

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
    base_url="https://api.mirai.interieur.gouv.fr",
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
Function calling / agents (haute qualité)        →  tools-pro
Function calling / agents (faible latence)       →  tools
Interaction rapide, faible latence               →  chat
Génération ou revue de code                      →  code ou code-completion
Nouveau moteur de code (Qwen3.8)                 →  code-1.0 ou code-completion-1.0
```

---

## Exemple d'intégration

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.mirai.interieur.gouv.fr",
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

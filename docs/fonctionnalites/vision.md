# Vision — Compréhension d'images <Badge type="warning" text="Beta" />

Analyse d'images en langage naturel : description, extraction de texte (OCR), lecture de tableaux et de graphiques, questions-réponses sur une image. Interface 100% compatible OpenAI (contenu `image_url`). Basé sur le modèle `Qwen3-VL-8B-Instruct`.

**Endpoint :** `POST /v1/chat/completions`

---

## Catalogue

| Alias    | Modèle                      | Paramètres | Usage recommandé                                   |
| -------- | --------------------------- | ---------- | -------------------------------------------------- |
| `vision` | Qwen3-VL-8B-Instruct (FP8)  | 8B         | Description d'image, OCR, VQA, lecture de documents |

---

## Envoyer une image

Une image se transmet dans le champ `content` d'un message, via un bloc `image_url`. Deux modes sont possibles :

- **URL** — le modèle récupère l'image depuis une URL accessible. Aucune limite de taille de requête.
- **base64** — l'image est encodée directement dans la requête (`data:` URI). Pratique pour les images locales.

**Taille maximale de la requête : 50 Mo.** Une image encodée en base64 est ~33% plus volumineuse que le fichier d'origine ; côté client, prévoir cette marge (ou redimensionner l'image) pour rester sous la limite. Au-delà, la gateway répond `413 Request Entity Too Large`.

### Exemple — image par URL

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"
)

response = client.chat.completions.create(
    model="vision",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Décris cette image en trois points."},
            {"type": "image_url", "image_url": {"url": "https://exemple.fr/photo.jpg"}},
        ],
    }],
)
print(response.choices[0].message.content)
```

### Exemple — image en base64

```python
import base64
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.api.ai.numerique-interieur.com",
    api_key="<TOKEN>"
)

with open("document.jpg", "rb") as f:
    b64 = base64.b64encode(f.read()).decode()

response = client.chat.completions.create(
    model="vision",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Extrais le texte de ce document."},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
        ],
    }],
)
print(response.choices[0].message.content)
```

---

## Bonnes pratiques

- **Privilégier l'URL** pour les grandes images : pas d'encodage base64, pas de limite de taille de requête.
- **Redimensionner avant l'envoi** en base64 : le modèle ne tire pas de bénéfice d'une résolution excessive. Un plafond à ~1024 px sur le plus grand côté (JPEG qualité ~80) réduit fortement la taille de la requête et la latence.
- Le streaming (`stream=true`) est supporté, comme sur les autres modèles de chat.

---

## Quotas

Voir [Quotas et niveaux d'accès](/documentation/quotas) pour les limites de débit applicables. La limite de taille de requête (50 Mo) est indépendante du niveau d'accès.

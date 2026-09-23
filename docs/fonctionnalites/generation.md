# Génération d'images <Badge type="info" text="Bientôt disponible" />

Génération d'images à partir d'une description en langage naturel, via une interface compatible OpenAI. Ce service est en cours de déploiement : il n'est **pas encore accessible**.

**Endpoint prévu :** `POST /v1/images/generations`

---

## Ce qui est prévu

| Alias   | Modèle        | Paramètres | Usage recommandé                                       |
| ------- | ------------- | ---------- | ------------------------------------------------------ |
| `image` | Z-Image-Turbo | 6B         | Génération d'images à partir d'un texte (français, anglais) |

- Interface compatible avec l'API Images d'OpenAI (`prompt`, `size`, `n`).
- Image renvoyée encodée en base64 (`b64_json`).
- Ouverture d'abord en **bêta restreinte**, puis élargissement progressif.

Les quotas, exemples d'utilisation et performances mesurées seront publiés à l'ouverture du service.

---

## Être informé ou participer à la bêta

Contactez l'équipe MirAI via la page [Support](/support/).

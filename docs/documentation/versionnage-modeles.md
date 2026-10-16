# Versionnage des modèles

Chaque modèle expose désormais **deux formes de nom** : un alias court et un nom figé versionné. Objectif : vous laisser choisir entre la souplesse (toujours la dernière version) et la stabilité (une version qui ne bouge jamais), tout en restant **transparent** sur le moteur réellement utilisé.

---

## Deux formes de nom

| Forme                      | Exemple        | Comportement                                                                 | Quand l'utiliser                               |
| -------------------------- | -------------- | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| **Alias flottant**         | `code`, `chat` | Pointe vers la dernière version recommandée ; peut évoluer dans le temps.    | Prototypage, pour profiter des améliorations.  |
| **Nom figé (versionné)**   | `code-1.0`     | Immuable — les poids ne changent **jamais** sous ce nom.                     | Production, reproductibilité, tests de non-régression. |

> En production, privilégiez le **nom figé** : votre application obtient exactement le même modèle à chaque appel, même lorsque l'alias flottant est mis à jour vers une version plus récente.

---

## Noms figés disponibles

| Alias flottant     | Nom figé                | Moteur                       |
| ------------------ | ----------------------- | ---------------------------- |
| `chat-pro`         | `chat-pro-1.0`          | gpt-oss-120b                 |
| `tools-pro`        | `tools-pro-1.0`         | gpt-oss-120b                 |
| `chat`             | `chat-1.0`              | gemma-4-26B-A4B-it           |
| `tools`            | `tools-1.0`             | gemma-4-26B-A4B-it           |
| `code`             | `code-1.0`              | Qwen3.8-27B                  |
| `code-completion`  | `code-completion-1.0`   | Qwen3.8-27B                  |
| `vision`           | `vision-1.0`            | Qwen3-VL-8B-Instruct         |

> **Transition en cours pour `code` et `code-completion`.** Le nom figé `code-1.0` (et `code-completion-1.0`) correspond au nouveau moteur **Qwen3.8-27B**. Les alias `code` et `code-completion` servent encore Qwen3.6-35B le temps de la bascule : pour tester ou adopter dès maintenant le nouveau moteur, ciblez explicitement `code-1.0` / `code-completion-1.0`.

---

## Connaître le modèle réellement utilisé

Vous pouvez toujours savoir quel moteur a traité votre requête — de deux façons.

**1. Le champ `model` de la réponse** renvoie le **moteur réel** qui a répondu :

```json
{
  "id": "chatcmpl-...",
  "model": "Qwen/Qwen3.8-27B-FP8",
  "choices": [ ... ]
}
```

Vous savez ainsi exactement quel moteur a traité la requête. Avec un **alias flottant** (p. ex. `code`), tout changement de moteur — lors d'une montée de version — devient immédiatement visible dans ce champ ; avec un **nom figé** (p. ex. `code-1.0`), ce champ renvoie toujours le même moteur.

**2. L'endpoint `GET /v1/models`** liste chaque modèle avec son moteur réel dans le champ `backend_model` :

```json
{
  "id": "code-1.0",
  "backend_model": "Qwen/Qwen3.8-27B-FP8"
}
```

- `backend_model` — le moteur réel sous-jacent. Le tableau [Noms figés disponibles](#noms-figés-disponibles) ci-dessus donne la correspondance nom ↔ moteur pour chaque version.

---

## Modèles dépréciés : `code-next` et `code-completion-next` <Badge type="danger" text="Déprécié" />

Les noms `code-next` et `code-completion-next` étaient des **aperçus temporaires** du moteur Qwen3.8-27B. Ils sont désormais **dépréciés** et remplacés par les noms figés correspondants (même moteur, aucun changement de comportement) :

| Ancien nom (déprécié)     | À utiliser à la place     | Moteur        |
| ------------------------- | ------------------------- | ------------- |
| `code-next`               | `code-1.0`                | Qwen3.8-27B   |
| `code-completion-next`    | `code-completion-1.0`     | Qwen3.8-27B   |

> ⚠️ **Date de retrait : 30 novembre 2026.** Les noms `code-next` et `code-completion-next` seront supprimés à cette date. Après le 30 novembre 2026, un appel à l'un de ces noms renverra une erreur. Migrez vos intégrations vers `code-1.0` et `code-completion-1.0` avant cette échéance.

---

## Recommandations

- **Production / reproductibilité** → ciblez un **nom figé** (`code-1.0`, `chat-pro-1.0`, …).
- **Souplesse / dernières améliorations** → utilisez l'**alias flottant** (`code`, `chat`, …).
- **Vous utilisez `*-next`** → migrez vers le nom figé équivalent avant le **30 novembre 2026**.

Voir aussi le [catalogue des modèles LLM](/fonctionnalites/llm).

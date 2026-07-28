# Fonctionnalités

Vue d'ensemble des services disponibles sur MirAI API's, avec leurs performances mesurées en production.

---

## Comparatif des services

| Service | Statut | Débit mesuré | Latence p95 | Taux d'erreur |
|---|---|---|---|---|
| [Transcription audio](/fonctionnalites/transcription) | **Beta** | ~213 s / heure d'audio | variable | 0% |
| [Diarisation audio](/fonctionnalites/diarisation) | **Beta** | ~377 s / heure d'audio | variable | 0% |
| [LLM — Chat](/fonctionnalites/llm) | **Stable** | 26–140 tok/s | < 3.2 s (400 tok) | 0% |
| [Vision — Images](/fonctionnalites/vision) | **Beta** | — | — | — |
| [Embeddings](/fonctionnalites/embeddings) | **Beta** | 410 req/s | 1.03 s | 0% |
| [Reranking](/fonctionnalites/reranking) | **Beta** | 764 req/s | 855 ms | 0% |

> Chiffres issus de benchmarks de charge réels (k6, mai 2026). Taux d'erreur 0% sur l'ensemble des tests.

---

## Modes d'appel

Tous les services supportent le mode synchrone. Les services audio supportent également le mode **asynchrone** pour les traitements longs.

→ [Modes synchrone et asynchrone](/documentation/modes)

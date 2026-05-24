# MirAI API

API interne pour l'accès aux services d'IA du projet (LLM, transcription, diarisation, embeddings, reranking).

Ce dépôt contient la documentation publique (site VitePress), la configuration de build, l'image de production et les outils pour le développement local.

Table des matières
------------------

- [MirAI API](#mirai-api)
  - [Table des matières](#table-des-matières)
  - [Présentation](#présentation)
  - [Prérequis](#prérequis)
  - [Démarrage rapide](#démarrage-rapide)
  - [Commandes utiles](#commandes-utiles)
  - [Architecture du dépôt](#architecture-du-dépôt)
  - [Déploiement (Docker)](#déploiement-docker)
  - [Configuration et sécurité](#configuration-et-sécurité)
  - [Notes techniques](#notes-techniques)
  - [Contribuer](#contribuer)

Présentation
------------

MirAI API expose une passerelle unifiée vers plusieurs services d'intelligence artificielle destinés aux usages internes et partenaires :

- génération de texte / chat (LLM)
- transcription et diarisation audio
- embeddings et recherche sémantique
- reranking

La documentation utilisateur (guides, exemples, quotas, modes d'appel) se trouve dans le dossier [docs/](docs/).

Prérequis
---------

- macOS / Linux (développement)
- Bun (gestionnaire de paquets et runtime recommandé)
- Docker (pour construire l'image de production)
- `make` (les cibles pratiques sont fournies dans le `Makefile`)

Installation de Bun (exemple macOS / Linux) :

```bash
curl -fsSL https://bun.sh/install | bash
```

Démarrage rapide
-----------------

1. Clonez le dépôt :

```bash
git clone https://github.com/IA-Generative/mirai-api.git
cd mirai-api
```

2. Installez les dépendances et lancez le site de documentation en local :

```bash
make install    # utilise bun install
make dev        # lance VitePress en dev
```

3. Pour construire le site statique :

```bash
make build
make preview
```

Commandes utiles
----------------

- Installer : `make install` (ou `bun install`)
- Développement : `make dev` (ou `bun run dev`)
- Construction : `make build`
- Prévisualisation : `make preview`
- Lint : `make lint`
- Correction automatique : `make lint-fix`
- Typecheck : `make tsc`
- CI local : `make ci`
- Construire l'image Docker de production : `make docker-build`
- Lancer l'image : `make docker-run`

Les cibles sont définies dans le [Makefile](Makefile).

Architecture du dépôt
--------------------

- [docs/](docs/) — site de documentation (VitePress)
- [nginx/](nginx/) — configuration NGINX utilisée pour l'image de production ([nginx/nginx.conf](nginx/nginx.conf))
- [helm/](helm/) — chart Helm pour déploiement Kubernetes
- `Dockerfile` — build multi-stage (Bun → NGINX prod)
- `Makefile` — commandes d'aide pour développeurs et CI
- `tsconfig.json` — configuration TypeScript
- `eslint.config.js` — configuration ESLint (Antfu + YAML/MD)

Déploiement (Docker)
--------------------

L'image de production est construite en multi-stage : build avec Bun puis copie des fichiers statiques dans une image `nginx` durcie.

```bash
make docker-build
make docker-run
# ou manuellement
docker build -t mirai-api --target prod .
docker run --rm -p 8080:8080 mirai-api
```

Le fichier de configuration NGINX se trouve dans [nginx/nginx.conf](nginx/nginx.conf).

Configuration et sécurité
------------------------

- L'authentification est gérée via Zitadel : voir la page [Documentation/Authentification](/documentation/authentification).
- Les tokens sont transmis dans l'en-tête `Authorization: Bearer <TOKEN>`.
- Veillez à ne pas committer de secrets. Utilisez des variables d'environnement dans vos pipelines.

Notes techniques
-----------------

- Gestionnaire et runtime : Bun (fast installs, bundling et exécution locale)
- TypeScript : configuration orientée ESM/bundler (`tsconfig.json`)
- Lint : ESLint avec la configuration `@antfu` et plugins pour Markdown/YAML
- VitePress : configuration dans [docs/.vitepress/config.ts](docs/.vitepress/config.ts) — plugins mermaid et twoslash sont activés

Contribuer
----------

Les contributions sont les bienvenues. Processus recommandé :

1. Fork du dépôt
2. Créer une branche `feat/ma-fonctionnalite` ou `fix/une-correction`
3. Installer les dépendances `make install`
4. Exécuter les contrôles locaux : `make lint && make tsc && make build`
5. Ouvrir une Pull Request contre `main`

Respecter les messages de commit conventionnels (Conventional Commits) facilite la revue.

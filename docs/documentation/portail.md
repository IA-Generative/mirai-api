# Premiers pas sur le portail d'accès

Ce guide montre, capture d'écran à l'appui, comment obtenir et gérer votre premier token depuis le [portail d'accès](https://acces.api.ai.numerique-interieur.com) — sans rien installer. Il s'adresse aux niveaux **Découverte** et **Développeur** (voir [Quotas et niveaux d'accès](/documentation/quotas)).

> Le niveau **Découverte** est actif par défaut : vous pouvez suivre ce guide immédiatement. Le niveau **Développeur** nécessite d'abord une demande auprès de l'équipe MirAI (voir [Contact](/support/#contact)) ; une fois l'accès accordé, la suite est identique.

---

## 1. Se connecter

Rendez-vous sur [acces.api.ai.numerique-interieur.com](https://acces.api.ai.numerique-interieur.com) et connectez-vous à MirAI — c'est la même connexion que pour les autres services MirAI, pas un compte à part. Vous arrivez sur la page **Utilisation**, vide tant qu'aucun token n'existe.

![Page d'accueil du portail après connexion](/portail/01-connexion.jpg)

---

## 2. Créer votre premier token

Ouvrez **Mes jetons** dans le menu, puis **Créer un nouveau jeton**.

![Mes jetons d'accès personnels, aucun token pour le moment](/portail/02-mes-jetons-vide.jpg)

Choisissez un rôle par service (audio, embedding, llm, rerank). Au niveau Découverte, une seule option apparaît par service.

![Sélection du rôle Découverte pour le service llm](/portail/03-choisir-role.jpg)

Donnez un nom au token (pour vous y retrouver plus tard) et une date d'expiration — **90 jours maximum** pour les niveaux Découverte et Développeur.

![Formulaire de création rempli, nom et date d'expiration](/portail/04-formulaire-rempli.jpg)

Cliquez sur **Créer**. Le token s'affiche **une seule fois** : cliquez sur **Afficher** pour le révéler, **Copiez**-le et conservez-le dans un gestionnaire de secrets avant de fermer la fenêtre — il ne sera plus jamais accessible depuis le portail.

![Fenêtre de confirmation, token créé et masqué](/portail/05-jeton-cree.jpg)

---

## 3. Utiliser votre token

Votre token apparaît maintenant dans la liste, avec son statut et sa date d'expiration.

![Liste des tokens avec le token nouvellement créé, statut Actif](/portail/06-liste-jetons.jpg)

Pour l'utiliser dans vos appels API, voir [Authentification](/documentation/authentification#utiliser-le-token) (header `Authorization`, exemples curl et SDK OpenAI).

---

## 4. Suivre votre utilisation

L'onglet **Utilisation** affiche votre consommation par service et par rôle.

![Page Utilisation avec le rôle llm-tier-1, aucune consommation pour le moment](/portail/08-utilisation.jpg)

---

## 5. Renouveler un token avant expiration (rotation)

Depuis **Mes jetons**, ouvrez **Détails** sur votre token.

![Fenêtre de détails d'un token, avec les actions Révoquer, Rotation et Supprimer le compte](/portail/07-details-jeton.jpg)

Cliquez sur **Rotation** et choisissez une nouvelle date d'expiration.

![Fenêtre de rotation, nouvelle date d'expiration](/portail/09-rotation-dialogue.jpg)

Un **nouveau token** est créé immédiatement, affiché une seule fois comme à la création.

![Confirmation de rotation, nouveau token masqué](/portail/10-rotation-resultat.jpg)

**L'ancien token reste valide** : basculez vos systèmes sur le nouveau, puis révoquez l'ancien depuis la même fenêtre de détails — les deux coexistent le temps de la transition, sans interruption de service.

![Détails du token après rotation, deux tokens actifs listés séparément](/portail/11-details-deux-jetons.jpg)

---

## 6. Révoquer ou supprimer

- **Révoquer** (bouton en face de chaque token) : invalide uniquement ce token, sans toucher aux autres.
- **Supprimer le compte** : supprime le token, tous ceux en cours de rotation, et libère le nom utilisé — irréversible.

---

## Aller plus loin

- [Authentification](/documentation/authentification) — utiliser le token dans vos requêtes
- [Quotas et niveaux d'accès](/documentation/quotas) — limites par niveau et par service
- [Exemples d'intégration](/documentation/exemples) — Python, JavaScript, curl
- [FAQ](/documentation/faq) et [Support](/support/) — en cas de blocage

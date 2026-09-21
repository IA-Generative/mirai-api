# Preview par Pull Request

Chaque PR portant le label `preview` obtient son propre namespace
(`preview-mirai-api-<n>`) et une URL
`https://mirai-api-pr-<n>.preview.mirai-hp.cpin.numerique-interieur.com`.

## Fonctionnement

1. Le workflow `.github/workflows/preview.yml` construit l'image
   `ghcr.io/ia-generative/mirai-api-docs:pr-<n>-<sha8>` et commente l'URL sur la PR.
2. L'ApplicationSet `preview-mirai-api` détecte la PR et déploie le chart `helm/` à la
   révision de la PR, avec ce tag et l'hôte dédié, sur le cluster `sdid-app-hp`.
3. À la fermeture ou au merge de la PR (ou au retrait du label), l'Application
   et le namespace sont supprimés.

## Où est la configuration ?

L'ApplicationSet n'est pas dans ce dépôt : il est déployé par l'ArgoCD central, de façon
générique pour plusieurs dépôts.

- Templates (`AppProject` `previews` + un `ApplicationSet` par dépôt) :
  `sdid-infra-k8s-app` → `apps/exploitation/argocd/templates/preview-*.yaml`
- Dépôts, image, hôte et cluster cible :
  `sdid-infra-k8s-values` → `clusters/exploitation/values-argocd.yaml`, clé `preview.repositories`

Pour ajouter un autre dépôt, ajouter une entrée dans `preview.repositories`, créer le label
`preview` et un workflow de build d'image équivalent à `.github/workflows/preview.yml`.

## Prérequis

- Lecture des PR par l'ApplicationSet : credential template GitHub App d'ArgoCD
  (`preview.appSecretName`), installé sur l'organisation `IA-Generative`.
- DNS wildcard `*.preview.mirai-hp.cpin.numerique-interieur.com` vers le LB `mirai-nginx`
  de `sdid-app-hp`. Les certificats sont émis par host via cert-manager avec le
  `ClusterIssuer` `letsencrypt-prod` (annotation par défaut du chart), en DNS-01 : le domaine doit
  être dans `dnsZone` du chart cert-manager (ici `mirai-hp.cpin.numerique-interieur.com`).
- Package ghcr `mirai-api-docs` privé. Un secret de pull nommé `registry-pull-secret`
  (type `kubernetes.io/dockerconfigjson`, token classic avec `read:packages`) doit être créé dans
  chaque namespace `preview-*` par un ExternalSecret, par exemple un `ClusterExternalSecret`
  ciblant le label `app.kubernetes.io/part-of: preview` (posé par l'ApplicationSet).
- Optionnel : webhook GitHub vers `https://<argocd>/api/webhook` (évite le polling de 2 min).

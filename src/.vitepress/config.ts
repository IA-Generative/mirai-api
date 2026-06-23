import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import mermaidPlugin from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    codeTransformers: [
      transformerTwoslash() as unknown as any,
    ],
    config: (md) => {
      // enable mermaid diagram support
      md.use(mermaidPlugin as any)
    },
  },
  title: 'CoFabNum',
  description: 'Conventions et bonnes pratiques de la Fabrique Numérique',
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Rechercher...',
            buttonAriaLabel: 'Rechercher',
          },
          modal: {
            backButtonTitle: 'effacer la recherche',
            displayDetails: 'afficher les détails',
            noResultsText: 'Aucun résultat pour ',
            resetButtonTitle: 'Réinitialiser',
            footer: {
              selectText: 'aller à ce texte',
              navigateText: 'naviguer dans les résultats',
              closeText: 'fermer',
            },
          },
        },
      },
    },
    outline: {
      level: [2, 3],
      label: 'Sur cette page',
    },
    logo: '/nouveau-logo-marianne-gouvernement.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Conventions', link: '/conventions/' },
      { text: 'Recettes', link: '/serveur/' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        link: '/ce-document',
        items: [],
      },
      {
        text: 'Environnement de travail',
        link: '/outils/',
        items: [
          { text: 'Installation Windows', link: '/installations/windows' },
          { text: 'Installation macOS', link: '/installations/macos' },
          { text: 'Installation Ubuntu', link: '/installations/ubuntu' },
        ],
      },
      {
        text: 'Conventions',
        link: '/conventions/',
        items: [
          { text: 'Documentation', link: '/conventions/documentation' },
          { text: 'Nommage', link: '/conventions/nommage' },
          { text: 'Architecture des dossiers', link: '/conventions/architecture-dossiers' },
          { text: 'TypeScript', link: '/conventions/typescript' },
          { text: 'API RESTful', link: '/conventions/api-restful' },
          { text: 'Lint et formattage', link: '/conventions/lint-formattage' },
          { text: 'Bonnes pratiques de code', link: '/conventions/autres' },
          { text: 'Déploiement', link: '/conventions/deploiement' },
          { text: 'Du POC à la production', link: '/conventions/poc-to-prod' },
        ],
      },
      {
        text: 'Stack technique',
        link: '/stack/',
        items: [
          { text: 'ESLint', link: '/stack/eslint' },
          { text: 'Prettier', link: '/stack/prettier' },
          { text: 'REST Client', link: '/stack/rest-client' },
          { text: 'Prisma (ORM)', link: '/stack/prisma' },
        ],
      },
      {
        text: 'Recettes client',
        link: '/client/',
        items: [
          { text: 'Vue 3', link: '/client/vue3' },
          { text: 'Nuxt 3', link: '/client/nuxt3' },
          { text: 'Toaster', link: '/client/toaster' },
        ],
      },
      {
        text: 'Recettes serveur',
        link: '/serveur/',
        items: [
          { text: 'NestJS', link: '/serveur/nestjs' },
          { text: 'Fastify', link: '/serveur/fastify' },
          { text: 'FastAPI', link: '/serveur/fastapi' },
        ],
      },
      {
        text: 'Monorepo',
        link: '/monorepo/',
        items: [
          { text: 'pnpm workspaces', link: '/monorepo/pnpm' },
          { text: 'Turborepo', link: '/monorepo/turbo' },
          { text: 'Gabarit', link: '/monorepo/gabarit' },
        ],
      },
      {
        text: 'CI/CD',
        link: '/ci-cd/',
        items: [
          { text: 'Principes', link: '/ci-cd/principes' },
          { text: 'Workflows réutilisables', link: '/ci-cd/workflows-reutilisables' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dnum-mi/mirai-api' },
    ],
  },
})

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import mermaidPlugin from 'vitepress-plugin-mermaid'

// Restored config — simplified and adapted to this repository's docs.
export default defineConfig({
  title: 'CoFabNum',
  description: 'Conventions et bonnes pratiques',
  markdown: {
    codeTransformers: [transformerTwoslash() as unknown as any],
    config: md => md.use(mermaidPlugin as any),
  },
  themeConfig: {
    nav: [
      { text: 'Présentation', link: '/presentation/' },
      { text: 'Documentation', link: '/documentation/' },
      { text: 'Fonctionnalités', link: '/fonctionnalites/' },
      { text: 'Support', link: '/support/' },
    ],
    sidebar: [
      { text: 'Présentation', link: '/presentation/' },
      {
        text: 'Documentation',
        link: '/documentation/',
        items: [
          { text: 'Authentification', link: '/documentation/authentification' },
          { text: 'Exemples', link: '/documentation/exemples' },
          { text: 'Modes', link: '/documentation/modes' },
          { text: 'Quotas', link: '/documentation/quotas' },
        ],
      },
      {
        text: 'Fonctionnalités',
        link: '/fonctionnalites/',
        items: [
          { text: 'Aperçu', link: '/fonctionnalites/' },
          { text: 'Diarisation', link: '/fonctionnalites/diarisation' },
          { text: 'Embeddings', link: '/fonctionnalites/embeddings' },
          { text: 'LLM', link: '/fonctionnalites/llm' },
          { text: 'Reranking', link: '/fonctionnalites/reranking' },
          { text: 'Transcription', link: '/fonctionnalites/transcription' },
        ],
      },
      { text: 'Support', link: '/support/' },
    ],
    outline: { level: [2, 3], label: 'Sur cette page' },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Rechercher...', buttonAriaLabel: 'Rechercher' },
          modal: {
            backButtonTitle: 'effacer la recherche',
            displayDetails: 'afficher les détails',
            noResultsText: 'Aucun résultat pour ',
            resetButtonTitle: 'Réinitialiser',
            footer: { selectText: 'aller à ce texte', navigateText: 'naviguer dans les résultats', closeText: 'fermer' },
          },
        },
      },
    },
    logo: '/nouveau-logo-marianne-gouvernement.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/IA-Generative/mirai-api' }],
    editLink: {
      pattern: 'https://github.com/IA-Generative/mirai-api/edit/main/docs/:path',
      text: 'Proposez une modification sur GitHub',
    },
    lastUpdated: { text: 'Dernière mise à jour' } as any,
    footer: {
      message: 'Documentation maintained by the team',
      copyright: `Copyright © ${new Date().getFullYear()} IA-Generative`,
    },
  },
})

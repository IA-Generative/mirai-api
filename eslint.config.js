import antfu from '@antfu/eslint-config'

export default antfu({
  // Enable TypeScript support
  typescript: true,
  // YAML linting rules
  yaml: {
    overrides: {
      'yaml/quotes': ['error', { prefer: 'double' }],
      'yaml/indent': ['error', 2, { indentBlockSequences: false }],
    },
  },
  // Files and globs to ignore
  ignores: [
    '**/node_modules',
    '**/pnpm-lock.yaml',
    '**/.turbo',
    '**/dist/',
    '**/types/',
    '**/coverage/',
    '**/playwright-report/',
    '**/test-results/',
    '**/templates/**/*.{yaml,yml}',
    '**/Chart.yaml',
    'helm/**',
    'charts/**',
    '**/*.d.ts',
    '**/*.md/*.js',
    '**/*.md/*.ts',
  ],
  rules: {
    'style/comma-dangle': ['error', 'always-multiline'],
    'no-irregular-whitespace': 'off',
  },
})
  .override('antfu/node/rules', {
    rules: {
      'node/prefer-global/process': ['error', 'always'],
      'node/prefer-global/console': ['error', 'always'],
      'node/prefer-global/buffer': ['error', 'always'],
    },
  })

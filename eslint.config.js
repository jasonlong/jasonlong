import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      ...prettier.rules,
      semi: 'off',
      'comma-dangle': 'off',
    },
  },
]

module.exports = {
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
    }
  },

  'plugins': [
    'react',
    'import',
  ],

  'extends': [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/react',
    'plugin:react/recommended',
  ],

  'settings': {
    'import/resolver': 'webpack',
  },

  'rules': {
    'array-bracket-spacing': [2, 'never'],
    'block-scoped-var': 2,
    'brace-style': [2, '1tbs'],
    'camelcase': 1,
    'computed-property-spacing': [2, 'never'],
    'consistent-this': [2, 'self'],
    'curly': 2,
    'eol-last': 2,
    'eqeqeq': [2, 'smart'],
    'id-match': [2, '^(_?[a-zA-Z]+([a-zA-Z0-9]+)*)|([A-Z0-9_]+)$', {'properties': true}],
    'indent': [2, 2, {'SwitchCase': 1}],
    'key-spacing': [2, {'beforeColon': false, 'afterColon': true}],
    'linebreak-style': [2, 'unix'],
    'max-depth': [1, 3],
    'max-len': [1, 110],
    'max-nested-callbacks': [2, 3],
    'max-statements': [1, 25],
    'new-cap': 1,
    'no-extend-native': 2,
    'no-extra-semi': 2,
    'no-mixed-spaces-and-tabs': 2,
    'no-multi-spaces': 2,
    'no-multiple-empty-lines': [2, {'max': 2}],
    'no-spaced-func': 2,
    'no-trailing-spaces': 2,
    'no-undef': 2,
    'no-undef-init': 2,
    'no-unused-vars': 1,
    'no-use-before-define': [2, 'nofunc'],
    'object-curly-spacing': [2, 'never'],
    'quotes': [2, 'single', 'avoid-escape'],
    'semi': [2, 'always'],
    'semi-spacing': [2, {'before': false, 'after': true}],
    'keyword-spacing': [2, {'before': true, 'after': true, 'overrides': {}}],
    'space-before-function-paren': [2, 'never'],
    'space-in-parens': [2, 'never'],
    'space-unary-ops': [1, {'words': true, 'nonwords': false}],
    'spaced-comment': [2, 'always'],
    'yoda': [2, 'never'],

    'import/extensions': [2, 'never'],
  },
}

module.exports = {
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  customSyntax: 'postcss-html',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-prettier',
  ],
  rules: {
    "selector-class-pattern": null,
    'no-descending-specificity': null,
    'custom-property-no-missing-var-function': null
  }
}

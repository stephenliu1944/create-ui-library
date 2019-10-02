module.exports = {
    // 'extends': 'stylelint-config-standard',
    'rules': {
        'color-no-invalid-hex': true,
        'font-family-no-duplicate-names': true,
        'font-family-no-missing-generic-family-keyword': true,
        'function-calc-no-invalid': true,
        'function-calc-no-unspaced-operator': true,
        'string-no-newline': true,
        'unit-no-unknown': true,
        'property-no-unknown': true,
        'declaration-block-no-duplicate-properties': true,
        // 'selector-id-pattern': '^[a-z][a-zA-Z0-9]+$',          // camel case selectors, use the disable commands to turn off the rule.
        // 'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',       // camel case selectors, use the disable commands to turn off the rule.
        'selector-pseudo-class-no-unknown': [true, {
            ignorePseudoClasses: ['global']
        }],
        'selector-pseudo-element-no-unknown': true,
        'selector-type-no-unknown': true,
        'selector-pseudo-class-case': 'lower',
        'selector-type-case': 'lower',
        'media-feature-name-no-unknown': true,
        'at-rule-no-unknown': true,
        'comment-no-empty': true,
        'no-descending-specificity': true,
        'no-duplicate-at-import-rules': true,
        'no-duplicate-selectors': true,
        'no-empty-source': true,
        'no-extra-semicolons': true,
        'string-quotes': 'single',
        'property-case': 'lower',
        'max-empty-lines': 1,
        'function-max-empty-lines': 0,
        'selector-max-empty-lines': 0,
        'value-list-max-empty-lines': 0,
        // 'no-eol-whitespace': true,                       // issue: #3842
        'function-name-case': 'lower',
        'indentation': 4
    }
};
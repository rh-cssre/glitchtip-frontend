// @ts-check
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

// Flat-config port of the former .eslintrc.json. Only src/ is linted; the
// marketing project (projects/**) is ignored here and lints via its own target.
module.exports = tseslint.config(
  {
    ignores: ["projects/**/*", "dist/**/*"],
  },
  {
    files: ["**/*.ts"],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: ["tsconfig.json"],
      },
    },
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "gt", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "gt", style: "kebab-case" },
      ],
      "@angular-eslint/no-input-rename": "off",
      "@angular-eslint/prefer-inject": "warn",
      "@angular-eslint/no-output-on-prefix": "warn",
      // Not enforced under the previous angular-eslint 21 ruleset; keep the
      // flat-config migration behaviour-neutral rather than touching 29 components.
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  },
);

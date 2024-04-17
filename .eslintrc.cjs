const path = require("node:path");
module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: path.join(__dirname, "tsconfig.json"),
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:promise/recommended",
    "plugin:import/errors",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "import"],
  overrides: [
    {
      files: ["**/*.stack.ts"],
      rules: {
        "no-new": "off",
      },
    },
    {
      files: ["**/*.test.ts"],
      rules: {
        "@typescript-eslint/no-unsafe-assignment": "off",
      },
    },
  ],
  rules: {
    "no-duplicate-imports": "error",
    "no-else-return": "error",
    "@typescript-eslint/no-confusing-non-null-assertion": "error",
    "@typescript-eslint/no-confusing-void-expression": "error",
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-shadow": "error",
    "no-throw-literal": "off",
    "@typescript-eslint/no-throw-literal": "error",
    "@typescript-eslint/no-mixed-enums": "error",
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
  },
  ignorePatterns: [
    "*.d.ts",
    "*.js",
    "*.cjs",
    "*.mjs",
    "*.map",
    "node_modules",
    ".yarn",
    "dist",
    "**/cdk.out/**",
    "coverage",
    "docs",
    "__snapshots__",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      typescript: {},
    },
  },
};

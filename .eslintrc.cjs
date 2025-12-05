module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { project: "./tsconfig.json", ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react-refresh", "prettier"],
  rules: {
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "react-refresh/only-export-components": "warn",
    "prettier/prettier": "warn",
  },
};

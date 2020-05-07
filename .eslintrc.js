module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  env: {
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
};

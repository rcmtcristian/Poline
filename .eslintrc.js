module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  globals: {
    IS_DEVELOPMENT: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  overrides: [
    {
      files: ["*.pug"],
      parser: "pug-eslint-parser",
      plugins: ["pug"],
      rules: {
        // Configure Pug-specific rules if needed
      },
    },
  ],
};

module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  globals: {
    IS_DEVELOPMENT: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
};

// eslint-disable-next-line
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true,
  },
  plugins: [
    "prettier",
    "import",
    "@typescript-eslint",
    "react",
    "react-hooks-ssr",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "airbnb",
    "prettier",
    "airbnb/hooks",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/camelcase": "off",
    "no-unused-vars": "off",
    camelcase: "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/no-unescaped-entities": "off",
    "react/jsx-wrap-multilines": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": "off",
    "import/extensions": 0,
  },
  globals: {
    React: "writable",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".tsx", ".ts"], // see https://github.com/benmosher/eslint-plugin-import/issues/1573#issuecomment-566347246
      },
    },
  },
};

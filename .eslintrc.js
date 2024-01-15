/** @type {import('eslint').Linter.Config} **/
const options = {
  root: true,
  extends: ["@gdk/eslint-config/recommended"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    createDefaultProgram: true
  },
  ignorePatterns: [".build", "assets"]
};

module.exports = options;

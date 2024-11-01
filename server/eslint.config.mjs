import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { 
    files: ["**/*.js"],
    languageOptions: { 
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      }
    }
  },
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js", "**/jest.setup.js"],
    languageOptions: { 
      sourceType: "module",
      globals: {
        ...globals.jest,
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
];

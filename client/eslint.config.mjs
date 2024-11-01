import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { 
    files: ["**/*.js"],
    languageOptions: { 
      globals: {
        ...globals.browser,
        process: "readonly",
      }
    }
  },
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js", "**/setupTests.js"],
    languageOptions: { 
      sourceType: "module",
      globals: {
        ...globals.jest
      }
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    }
  },
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
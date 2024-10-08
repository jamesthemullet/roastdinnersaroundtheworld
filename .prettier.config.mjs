// .prettierrc.mjs

export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: "*.tsx",
      options: {
        parser: "typescript",
      },
    },
  ],
  config: {
    semi: true,
    tabWidth: 2,
    printWidth: 100,
    singleQuote: false,
    trailingComma: "none",
    jsxBracketSameLine: true,
    endOfLine: "auto",
  },
};

/** @type {import("prettier").Config} */

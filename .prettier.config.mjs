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
  ],
  config: {
    semi: true,
    tabWidth: 2,
    printWidth: 100,
    singleQuote: false,
    trailingComma: "none",
    jsxBracketSameLine: true,
  },
};

/** @type {import("prettier").Config} */

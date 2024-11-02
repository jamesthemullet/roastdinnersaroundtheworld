module.exports = {
  extends: "lighthouse:default",
  settings: {
    onlyCategories: ["performance"],
    throttlingMethod: "provided",
  },
};

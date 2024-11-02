module.exports = {
  extends: "lighthouse:default",
  settings: {
    onlyCategories: ["performance"],
    throttlingMethod: "provided", // Use the actual network speed, bypassing throttling
  },
};

module.exports = {
  testEnvironment: "jsdom",
  testURL: "http://localhost/",
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage/",
    "/tests/",
    "/dist/",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: ["**/?(*.)(test).{ts,tsx}"],
  collectCoverageFrom: ["./src/**/*.{ts,tsx}"],
};

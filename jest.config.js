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
    "/mocks/",
    "/dist/",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: ["**/?(*.)(test).{ts,tsx}"],
  collectCoverageFrom: ["./src/**/*.{ts,tsx}"],
};

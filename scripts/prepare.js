const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

// Remove unnecessary properties from package.json
delete pkg.scripts;
delete pkg.devDependencies;

// Copy package.json to the dist folder
fs.writeFileSync(
  path.resolve(__dirname, "../dist/package.json"),
  JSON.stringify(pkg, null, 2)
);

// Copy .npmignore to the dist folder
fs.copyFileSync(
  path.resolve(__dirname, "../.npmignore"),
  path.resolve(__dirname, "../dist/.npmignore")
);

// Copy README to the dist folder
fs.copyFileSync(
  path.resolve(__dirname, "../README.md"),
  path.resolve(__dirname, "../dist/README.md")
);

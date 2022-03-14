#!/bin/bash

# Exit when any command fail
set -eo pipefail

node ./scripts/prepare.js
cd ./dist || exit 1
npm config set //registry.npmjs.org/:_authToken="${NPM_AUTH_TOKEN}"

# Get package name from package.json
PACKAGE_NAME=$(cat package.json \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Get package version from package.json
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

if npm show "$PACKAGE_NAME" version | grep -w "$PACKAGE_VERSION" > /dev/null; then
  echo "$PACKAGE_NAME@$PACKAGE_VERSION is already published!";
else
  npm publish --access public
fi

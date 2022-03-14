#!/bin/bash

# Exit when any command fail
set -eo pipefail

node ./scripts/prepare.js
cd ./dist || exit 1
npm pack --dry-run

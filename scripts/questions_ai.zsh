#!/usr/bin/env zsh
set -e
TOPIC=${1:-Python}
N=${2:-5}
node ./scripts/questions_ai.mjs "$TOPIC" "$N"

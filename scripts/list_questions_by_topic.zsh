#!/usr/bin/env zsh
set -e
TOPIC=${1:-Python}
N=${2:-5}
node ./scripts/list_questions_by_topic.mjs "$TOPIC" "$N"

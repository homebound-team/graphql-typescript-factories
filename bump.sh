#!/bin/bash

# Generates a version number.
#
# Usage:
#   ./bump.sh package.json
#

file=$1
pattern=$(grep -o "[[:digit:]]\+\.0\.0-bump" < "${file}")
major=$(echo "${pattern}"| grep -o "^[[:digit:]]\+")
minor=$(git log --first-parent --format=%H | wc -l)
version="${major}.${minor}.0"
sed -i.bak "s/${pattern}/${version}/" "${file}"

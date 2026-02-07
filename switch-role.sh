#!/bin/bash
# Usage: ./switch-role.sh innovation-lead | rd-scientist | data-scientist
set -e

ROLE=$1
BASE_DIR=~/Personal_Projects/az-demo
TELOS_DIR="$BASE_DIR/.claude/skills/PAI/USER/TELOS"
CUSTOM_DIR="$BASE_DIR/.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS"

if [ -z "$ROLE" ]; then
  echo "Usage: ./switch-role.sh <role-name>"
  echo "Available roles: innovation-lead, rd-scientist, data-scientist"
  exit 1
fi

if [ ! -d "$BASE_DIR/roles/$ROLE" ]; then
  echo "Error: Role '$ROLE' not found in $BASE_DIR/roles/"
  exit 1
fi

# Swap TELOS
rm -rf "$TELOS_DIR"/*
cp -r "$BASE_DIR/roles/$ROLE/TELOS/"* "$TELOS_DIR/"

# Swap SKILLCUSTOMIZATIONS
rm -rf "$CUSTOM_DIR/Council" "$CUSTOM_DIR/THEALGORITHM"
cp -r "$BASE_DIR/roles/$ROLE/CUSTOMIZATIONS/"* "$CUSTOM_DIR/" 2>/dev/null || true

echo "Switched to role: $ROLE"
echo "Restart Claude Code session to activate."

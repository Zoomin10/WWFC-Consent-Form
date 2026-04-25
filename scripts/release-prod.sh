#!/usr/bin/env bash

set -e

echo "Checking working tree..."
if [ -n "$(git status --porcelain)" ]; then
  echo "You have uncommitted changes. Commit or stash them first."
  git status --short
  exit 1
fi

echo "Updating development..."
git checkout development
git pull origin development

echo "Updating production..."
git checkout production
git pull origin production

echo "Merging development into production..."
git merge development

echo "Pushing production..."
git push origin production

echo "Production release pushed."
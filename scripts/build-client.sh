#!/usr/bin/env bash

ARCHIVE_NAME=client-app.tar.gz
ARCHIVE_PATH="../static/$ARCHIVE_NAME"

cd ../client || exit
configuration=$(printenv ENV_CONFIGURATION)
if [[ -z $configuration ]]; then
  echo "Please, specify ENV_CONFIGURATION"
  exit 1
fi
if [[ -e $ARCHIVE_PATH ]]; then
  rm $ARCHIVE_PATH
fi
npm run build -- --configuration="$configuration"
cd ../static || exit
tar -czvf $ARCHIVE_NAME ./

#!/usr/bin/env bash

DB_FILEPATH="../data/users.db"

readLatinString() {
  local string=""
  while [[ -z $string ]]; do
    read -r string
    if [[ ! $string =~ [a-zA-Z] ]]; then
      echo 'Only latin symbols allowed!'
      string=""
    fi
  done
  echo "$string"
}

if [[ ! -e $DB_FILEPATH ]]; then
  echo -n 'users.db does not exist, create? y/n: '
  read -r answer
  if [[ $answer != 'y' ]]; then
    exit 1
  fi
  touch $DB_FILEPATH
fi

case "$1" in
add)
  echo "Please, type username"
  username="$(readLatinString)"
  echo "Please, specify role for $username"
  role="$(readLatinString)"
  echo "$username, $role" >>$DB_FILEPATH
  ;;
backup)
  backupName="$(date +%m%d%Y%H%M%S)-users.db.backup"
  cp "$DB_FILEPATH" "../data/$backupName"
  echo "$backupName has been created"
  ;;
restore)
  lastBackedUpFilename="$(ls ../data -t | grep '^[0-9]' | head -n1)"
  if [[ -z $lastBackedUpFilename ]]; then
    echo "No backup file found"
    exit 1
  fi
  cp "../data/$lastBackedUpFilename" "$DB_FILEPATH"
  echo "$lastBackedUpFilename have been restored"
  ;;
find)
  echo "Please, type username"
  username="$(readLatinString)"
  searchResult=$(grep "$username" $DB_FILEPATH)
  if [[ -z $searchResult ]]; then
    echo "User not found"
  fi
  echo "$searchResult"
  ;;
list)
  records="$(awk '{print NR". " $0}' $DB_FILEPATH)"
  if [[ $2 == "inverse" ]]; then
    records=$(echo "$records" | tac)
  fi
  echo "$records"
  ;;
help)
  ;&
*)
  printf "add - to add new user
backup - creates new file with current users.db content
restore - restore latest backup file
list [inverse] - prints content of users.db
find - finds users by name and prints
"
  ;;
esac

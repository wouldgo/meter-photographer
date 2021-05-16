#!/usr/bin/env bash

function do_it () {
  local CURRENT_DIR
  local OS_STATS_RUN_SCRIPT

  CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" && \
  OS_STATS_RUN_SCRIPT=${HOME}/.systemd-services/water-meter.sh

  export NVM_DIR="${HOME}/.nvm"
  # shellcheck disable=SC1091
  [ -s "${NVM_DIR}/nvm.sh" ] && \. "${NVM_DIR}/nvm.sh"

  REPO_DIR="${CURRENT_DIR}/.." && \
  mkdir -p "${HOME}/.systemd-services"

  cd "${REPO_DIR}" && \
  rm -Rf node_modules && \
  nvm use && \
  npm prune && \
  npm install --production && \
  echo "[ -s \"${NVM_DIR}/nvm.sh\" ] && \. \"${NVM_DIR}/nvm.sh\"
  cd ${REPO_DIR} && \
  nvm use && \
  npm start" > "${OS_STATS_RUN_SCRIPT}" && \
  chmod 700 "${OS_STATS_RUN_SCRIPT}" && \

  echo "
  [Unit]
  Description=water-meter

  [Service]
  User=pi
  Group=pi
  StandardOutput=syslog
  StandardError=syslog
  SyslogIdentifier=water-meter
  ExecStart=/bin/bash -c \"${OS_STATS_RUN_SCRIPT}\"
  Restart=always

  [Install]
  WantedBy=multi-user.target
  " | sudo tee -a /etc/systemd/system/water-meter.service
}

do_it "$@"

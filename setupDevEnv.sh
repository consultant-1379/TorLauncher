#!/bin/bash
function linklib {
  if [ -d "$1" ]; then
    cdt2 package link $1
  fi
}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${SCRIPT_DIR}/root
git clean -dfX
# Get latest deps
#npm list request || npm install request@2.81.0
cdt2 package install --autofill
# Link local development repos
linklib ../plugin
cd ${SCRIPT_DIR}

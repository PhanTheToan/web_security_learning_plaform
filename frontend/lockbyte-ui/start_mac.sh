#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export JAVA_HOME=$(/usr/libexec/java_home -v 17)

cleanup() {
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID
    fi
    exit
}

trap cleanup EXIT INT TERM

cd "$SCRIPT_DIR/../../backend/backend"
mvn spring-boot:run -DskipTests &
BACKEND_PID=$!

sleep 5

cd "$SCRIPT_DIR/../../frontend/lockbyte-ui"
npm run dev
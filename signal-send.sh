#!/bin/bash
FILE="$1"
RECIPIENT="$2"

echo "Sending $FILE to $RECIPIENT"
/opt/signal-cli send "$RECIPIENT" -a "$FILE" 

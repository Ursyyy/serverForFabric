#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Stop fabric"
 

cd "./fabric-samples/commercial-paper"

./network-clean.sh


#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Run fabrics dockers"
echo "-------------------"

cd "./fabric-samples"

if ! [ -d ./bin ]; then
./bootstrap.sh
fi

cd "./commercial-paper"

./network-starter.sh

cd "./organization/magnetocorp"
echo "Settings chaincode for MagnetoCorp"
echo "----------------------------------"
gnome-terminal -- /bin/bash -c './run_magnetocorp.sh'
cd "../digibank"
echo "Settings chaincode for digibank"
echo "-------------------------------"
gnome-terminal -- /bin/bash -c "./run_digibank.sh"
cd "${DIR}"


#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Run fabrics dockers"
echo "-------------------"

cd "./fabric-samples"

chmo +x ./bootstrap.sh
./bootstrap.sh


cd "./commercial-paper"

./network-starter.sh

cd "./organization/magnetocorp"
echo "Settings chaincode for MagnetoCorp"
echo "----------------------------------"
source magnetocorp.sh
peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0

peer lifecycle chaincode install cp.tar.gz

export PACKAGE_ID="cp_0:ddca913c004eb34f36dfb0b4c0bcc6d4afc1fa823520bb5966a3bfcf1808f40a"

peer lifecycle chaincode queryinstalled

export PACKAGE_ID="cp_0:ddca913c004eb34f36dfb0b4c0bcc6d4afc1fa823520bb5966a3bfcf1808f40a"

peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name papercontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA
cd "./application"
npm i
node enrollUser.js
echo "Finished"
echo "Settings chaincode for digibank"
echo "-------------------------------"

cd "../../digibank"
source ./digibank.sh
peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0

peer lifecycle chaincode install cp.tar.gz

export PACKAGE_ID="cp_0:ddca913c004eb34f36dfb0b4c0bcc6d4afc1fa823520bb5966a3bfcf1808f40a"

peer lifecycle chaincode queryinstalled

peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name papercontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA

peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} --channelID mychannel --name papercontract -v 0 --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent

cd "./application"
npm i
node enrollUser.js

echo "Finished"

cd "${DIR}"


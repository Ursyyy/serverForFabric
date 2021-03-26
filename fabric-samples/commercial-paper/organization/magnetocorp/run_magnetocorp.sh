source magnetocorp.sh
peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0

peer lifecycle chaincode install cp.tar.gz

export PACKAGE_ID="cp_0:ddca913c004eb34f36dfb0b4c0bcc6d4afc1fa823520bb5966a3bfcf1808f40a"

#peer lifecycle chaincode queryinstalled

export PACKAGE_ID="cp_0:ddca913c004eb34f36dfb0b4c0bcc6d4afc1fa823520bb5966a3bfcf1808f40a"

peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name papercontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA
cd "./application"
npm i
node enrollUser.js
echo "Finished"

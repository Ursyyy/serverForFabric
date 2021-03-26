# Server for Fabric-samples

## Install fabric-samples packages and configure it

Open a terminal, go to the directory with the folder downloaded from the git and write the commands
```bash
chmod +x ./run_fabric.sh
./run_fabric.sh
```

You are waiting until the script finishes, the script will install all the necessary files by itself

### Run node-server
After installing the script, you can start working with the api
First, you need to go to the folder with the server and write the command to install the necessary packages for npm

```bash
cd server
npm i
```
You need to edit the fabric-samples folder path in the config.json file. Open the file and paste the path to the folder `/commercial-paper/organisations/magnetocorp/application` into the `path_to_mag` value. Similar actions, but on the `/digibank` folder you need to insert into the value of the variable `path_to_dig`

After which you can start the node server and then server will be ready to work
```bash
node server
```

## Stop server

In the project folder run the command
```
./stop_fabric.sh
```

***

# API commands

### Issue a paper

In order to interact with the papers, you need to release them. Therefore, you initially need to run the api `/issuePaper` to issue paper from Magnetocorp. You need to make a POST-request to the address `localhost:PING/issuePaper`. In response, you can get an object
```
{
    "issue": [
        "Process issue transaction response.{\"class\":\"org.papernet.commercialpaper\",\"currentState\":1,\"issuer\":\"MagnetoCorp\",\"paperNumber\":\"00001\",\"issueDateTime\":\"2020-05-31\",\"maturityDateTime\":\"2020-11-30\",\"faceValue\":5000000,\"mspid\":\"Org2MSP\",\"owner\":\"MagnetoCorp\"}",
        "MagnetoCorp commercial paper : 00001 successfully issued for value 5000000"
    ]
}
```
corresponding to a successful paper issue, or an error.

### Buy a paper 

Once the paper is issued by Magnetocorp, Digibank can buy it. To do this, you need to send a POST-request to `localhost:PING/buyPaper`. In response, you can get an object
```
{
    "buy": [
        "Process buy_request transaction response.{\"class\":\"org.papernet.commercialpaper\",\"currentState\":2,\"faceValue\":5000000,\"issueDateTime\":\"2020-05-31\",\"issuer\":\"MagnetoCorp\",\"maturityDateTime\":\"2020-11-30\",\"mspid\":\"Org2MSP\",\"owner\":\"MagnetoCorp\",\"paperNumber\":\"00001\"}",
        "MagnetoCorp commercial paper : 00001 has been provisionally purchased : the transfer must now be completed by paper owner"
    ]
}
```
corresponding to a successful paper purchase, or an error.


### Redeem a paper

After the purchase of the paper by digibank, the paper should be redeemed. To do this, you need to send a post-request to the address `localhost:PING/redeemPaper`, then you can get a response object or an error
```

"redeem": [
        "Process redeem transaction response.{\"class\":\"org.papernet.commercialpaper\",\"currentState\":4,\"faceValue\":5000000,\"issueDateTime\":\"2020-05-31\",\"issuer\":\"MagnetoCorp\",\"maturityDateTime\":\"2020-11-30\",\"mspid\":\"Org2MSP\",\"owner\":\"MagnetoCorp\",\"paperNumber\":\"00001\",\"redeemDateTime\":\"2020-11-30\"}",
        "MagnetoCorp commercial paper : 00001 successfully redeemed with MagnetoCorp"
    ]
```


### Transaction history 

To get a list of all securities transactions, you need to use a GET-request to `localhost:PING/getPaper`. In response, you will receive an object that stores a description of the transactions that have occurred.

```
{
    "data": [
        {
            "Block": 3,
            "transaction": "0",
            "Transaction ID": "0e2ef56e6162a949839abba04e54e40fd2077f6331f89248950812097578a19c",
            "Timestamp": "Fri, 26 Mar 2021 08:46:52 GMT",
            "Inputs": "Inputs: ApproveChaincodeDefinitionForMyOrg papercontract0JIGEcp_0:ddca913c004eb34f36dfb0b4c0bcc6d4afc1fa823520bb5966a3bfcf1808f40a ",
            "Keys updated": "",
            "Endorsers": "Org1MSP "
        },
        {
            "Block": 3,
            "transaction": "1",
            "Transaction ID": "e1bdca42dc0645e2b3baedba02d20cf992401f606d0dc076e8352900f150997e",
            "Timestamp": "Fri, 26 Mar 2021 08:46:53 GMT",
            "Inputs": "Inputs: ApproveChaincodeDefinitionForMyOrg papercontract0JIGEcp_0:ddca913c004eb34f36dfb0b4c0bcc6d4afc1fa823520bb5966a3bfcf1808f40a ",
            "Keys updated": "",
            "Endorsers": "Org2MSP "
        },
        {
            "Block": 4,
            "transaction": "0",
            "Transaction ID": "94a331244c7b3948b8363ef90c87a954ec7bbe729147371f6e69340e8959579f",
            "Timestamp": "Fri, 26 Mar 2021 08:46:58 GMT",
            "Inputs": "Inputs: CommitChaincodeDefinition papercontract0 ",
            "Keys updated": "",
            "Endorsers": "Org1MSP Org2MSP "
        },
        {
        .....
```


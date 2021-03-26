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

***

# API commands

### Issue a paper

In order to interact with the papers, you need to release them. Therefore, you initially need to run the api `/issuePaper` to issue paper from Magnetocorp. You need to make a POST-request to the address `localhost:PING/issuePaper`. In response, you can get an object

corresponding to a successful paper issue, or an error.

### Buy a paper 

Once the paper is issued by Magnetocorp, Digibank can buy it. To do this, you need to send a POST-request to `localhost:PING/buyPaper`. In response, you can get an object

corresponding to a successful paper purchase, or an error.

### Transaction history 

To get a list of all securities transactions, you need to use a GET-request to `localhost:PING/getPaper`. In response, you will receive an object that stores a description of the transactions that have occurred.

### Redeem a paper

***

#### **Coming soon**


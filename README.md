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

After which you can start the node server and then server will be ready to work
```bash
node server
```

***

# API commands

### Issue a paper

In order to interact with the papers, you need to release them. Therefore, you initially need to run the api `/issuePaper` to issue paper from Magnetocorp. You need to make a get-request to the address `localhost:PING/issuePaper`. In response, you can get an object

corresponding to a successful paper issue, or an error.




"use strict";

const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const path = require("path");
const fs = require("fs");

let finished;
module.exports = async function main(PATH) {
    let res = []
    try {
	    const wallet = await Wallets.newFileSystemWallet(PATH + '../identity/user/isabella/wallet');
        const gateway = new Gateway();
        const userName = 'isabella';
        let connectionProfile = yaml.safeLoad(fs.readFileSync(PATH + '../gateway/connection-org2.yaml', 'utf8'));
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };
        await gateway.connect(connectionProfile, connectionOptions);
        const network = await gateway.getNetwork('mychannel');
        finished = false;
        
        const listener = async (event) => {
            if (event.blockData !== undefined) {
                for (const i in event.blockData.data.data) {
                    
                    if (event.blockData.data.data[i].payload.data.actions !== undefined) {
                        let item = {}
                        item['Block'] = parseInt(event.blockData.header.number)
                        item['transaction'] = i
                        const inputArgs = event.blockData.data.data[i].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args;
                        const tx_id = event.blockData.data.data[i].payload.header.channel_header.tx_id;
                        const txTime = new Date(event.blockData.data.data[i].payload.header.channel_header.timestamp).toUTCString();
                        item['Transaction ID'] = tx_id
                        item['Timestamp'] = txTime
                        let inputData = 'Inputs: ';
                        for (let j = 0; j < inputArgs.length; j++) {
                            const inputArgPrintable = inputArgs[j].toString().replace(/[^\x20-\x7E]+/g, '');
                            inputData = inputData.concat(inputArgPrintable, ' ');
                        }
                        item['Inputs'] = inputData
                        let keyData = '';
                        for (const l in event.blockData.data.data[i].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes) {
                            keyData = keyData.concat(event.blockData.data.data[i].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[l].key, ' ');
                        }
                        item['Keys updated'] = keyData
                        let endorsers = '';
                        for (const k in event.blockData.data.data[i].payload.data.actions[0].payload.action.endorsements) {
                            endorsers = endorsers.concat(event.blockData.data.data[i].payload.data.actions[0].payload.action.endorsements[k].endorser.mspid, ' ');
                        }
                        item['Endorsers'] = endorsers
                        if ((event.blockData.metadata.metadata[2])[i] !== 0) {
                            console.log('INVALID TRANSACTION');
                        }
                        res.push(item)
                    }
                }
            }
        };
        const options = {
            type: 'full',
            startBlock: 1
        };
        await network.addBlockListener(listener, options);
        while (!finished) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            break;
        }
        //console.log(res)
        gateway.disconnect();
        return res
    }
    catch (error) {
        console.error('Error: ', error);
        process.exit(1);
    }
    finally{
        return res
    }
}
// void main();

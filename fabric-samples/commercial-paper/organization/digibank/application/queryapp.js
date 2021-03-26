/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to query the ledger
 * 5. Evaluate transactions (queries)
 * 6. Process responses
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');


// Main program function
module.exports = async function main(PATH) {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet(PATH + '../identity/user/balaji/wallet');


    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();
    let res = []
    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = 'balaji';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync(PATH + '../gateway/connection-org1.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }

        };
        // console.log("---------------------------------")
        // Connect to gateway using application specified parameters
        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

        // queries - commercial paper
        let queryResponse = await contract.evaluateTransaction('queryHistory', 'MagnetoCorp', '00001');
        
        let json = JSON.parse(queryResponse.toString());
        res.push({
            'Query Commercial Paper History': json
        })
        // 2 ownership query
        let queryResponse2 = await contract.evaluateTransaction('queryOwner', 'MagnetoCorp');
        json = JSON.parse(queryResponse2.toString());
        res.push({
            "Query Commercial Paper Ownership.... Papers owned by MagnetoCorp": json
        })
    
        // 3 partial key query
        let queryResponse3 = await contract.evaluateTransaction('queryPartial', 'MagnetoCorp');

        json = JSON.parse(queryResponse3.toString());
        res.push({
            "Query Commercial Paper Partial Key.... Papers in org.papernet.papers namespace and prefixed MagnetoCorp": json
        })

        // 4 Named query - all redeemed papers
        let queryResponse4 = await contract.evaluateTransaction('queryNamed', 'redeemed');

        json = JSON.parse(queryResponse4.toString());
        res.push({
            "Named Query: ... All papers in org.papernet.papers that are in current state of redeemed": json
        })

        // 5 named query - by value
        let queryResponse5 = await contract.evaluateTransaction('queryNamed', 'value');

        json = JSON.parse(queryResponse5.toString());
        res.push({
            "Named Query:.... All papers in org.papernet.papers with faceValue > 4000000": json
        })    
    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
        res.push(error)

    } finally {

        // Disconnect from the gateway
        gateway.disconnect();
        return res
    }
}

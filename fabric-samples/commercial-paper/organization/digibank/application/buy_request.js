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
 * 4. Construct request to buy (buy_request) commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const CommercialPaper = require('../../magnetocorp/contract/lib/paper.js');


// Main program function
module.exports = async function main (PATH) {

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

        // Connect to gateway using application specified parameters
        await gateway.connect(connectionProfile, connectionOptions);
        const network = await gateway.getNetwork('mychannel');
        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');
        const buyResponse = await contract.submitTransaction('buy_request', 'MagnetoCorp', '00001', 'MagnetoCorp', 'DigiBank', '4900000', '2020-05-31');
        res.push('Process buy_request transaction response.' + buyResponse);

        let paper = CommercialPaper.fromBuffer(buyResponse);

        res.push(`${paper.issuer} commercial paper : ${paper.paperNumber} has been provisionally purchased : the transfer must now be completed by paper owner`);
    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {
        gateway.disconnect();
        return res
    }
}
// main().then(() => {

//     console.log('Buy_request program complete.');

// }).catch((e) => {

//     console.log('Buy_request program exception.');
//     console.log(e);
//     console.log(e.stack);
//     process.exit(-1);

// });

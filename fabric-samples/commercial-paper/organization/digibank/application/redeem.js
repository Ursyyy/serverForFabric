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
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const CommercialPaper = require('../contract/lib/paper.js');


// Main program function
module.exports = async function main(PATH) {

  // A wallet stores a collection of identities for use
  const wallet = await Wallets.newFileSystemWallet(PATH + '../identity/user/balaji/wallet');


  // A gateway defines the peers used to access Fabric networks
  const gateway = new Gateway();

  // Main try/catch block
  try {
        const userName = 'balaji';
        
    let connectionProfile = yaml.safeLoad(fs.readFileSync(PATH + '../gateway/connection-org1.yaml', 'utf8'));

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled:true, asLocalhost: true }
    };
    console.log('Connect to Fabric gateway.');

    await gateway.connect(connectionProfile, connectionOptions);
    console.log('Use network channel: mychannel.');

    const network = await gateway.getNetwork('mychannel');
    console.log('Use org.papernet.commercialpaper smart contract.');

    const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');
    console.log('Submit commercial paper redeem transaction.');

    const redeemResponse = await contract.submitTransaction('redeem', 'MagnetoCorp', '00001', 'DigiBank', 'Org2MSP', '2020-11-30');
    console.log('Process redeem transaction response.');

    let paper = CommercialPaper.fromBuffer(redeemResponse);

    console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully redeemed with ${paper.owner}`);

    console.log('Transaction complete.');

  } catch (error) {

    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);

  } finally {

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.')
    gateway.disconnect();

  }
}
// main().then(() => {

//   console.log('Redeem program complete.');

// }).catch((e) => {

//   console.log('Redeem program exception.');
//   console.log(e);
//   console.log(e.stack);
//   process.exit(-1);

// });

'use strict';

const multer = require('multer'),
    upload = multer()

let config = require('./config.json')

const PATH_TO_ORG_MAG = config["path_to_mag"],
      PATH_TO_ORG_DIG = config["path_to_dig"]

const History = require(PATH_TO_ORG_MAG + 'cpListener'),
    Issue = require(PATH_TO_ORG_MAG + 'issue'),
    Redeem = require(PATH_TO_ORG_DIG + 'redeem'),
    Buy = require(PATH_TO_ORG_DIG + 'buy')

module.exports = app => {
    app.route('/getPaper').get(upload.fields([]), (req, resp) => {
        History(PATH_TO_ORG_MAG).then((arg) => {
            console.log("Transfer complete")
            resp.send({'data': arg})
        })
        .catch(err => {
            console.log(err)
            resp.send({'error': err})
        })
        
    })

    app.route('/buyPaper').post((req, resp) => {
        Buy(PATH_TO_ORG_DIG).then(arg => {
            console.log('Buy_request program complete.');
            resp.send({
                'buy': arg
            })
        })
        .catch(err => {
            console.log(err)
            resp.send({'error': err})
        })
    })

    app.route('/issuePaper').post(upload.fields([]), (req, resp) =>{
        Issue(PATH_TO_ORG_MAG).then(arg => {
            console.log('Issue program complete.');
            resp.send({'issue': arg})
        })
        .catch(err => {
            console.log(err)
            resp.send({'error': err})
        })
    })

    app.route('/redeemPaper').post(upload.fields([]), (req, resp) => {
        Redeem(PATH_TO_ORG_DIG).then(arg => {
            console.log('Redeem program complete.');
            resp.send({'redeem': arg})
        })
        .catch(err => {
            console.log(err)
            resp.send({'error': err})
        })
    })
}


'use strict'

const _ = require('lodash')
const request = require('request-promise-native')
const env = require('../env')
const {
  awaitServerPubkey,
  getTxnCreator,
  submitTxns,
  encodeTimestampedPayload
} = require('../system/submit_utils')

const SERVER = process.env.SERVER || 'http://localhost:3000'


console.log('Creating Materials . . .')

const CreateMaterial = (ID,Properties) => {

      let Payload =  {
        ID : ID,
        Verb: 'Create',
        Properties: 
          [
            Properties.name,
            Properties.group,
            Properties.type,
            Properties.price,
            Properties.cost,
            Properties.amount
          ]
        }
      
      // submitTxns(Payload)
      console.log(Payload)
}

module.exports = {
    CreateMaterial
}
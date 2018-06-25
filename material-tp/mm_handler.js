
'use strict'

const mmPayload = require('./mm_payload')
const { MM_NAMESPACE, MM_VERSION, MM_FAMILY, MMState } = require('./mm_state')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class MMHandler extends TransactionHandler {
  constructor () {
    super(MM_FAMILY, [MM_VERSION], [MM_NAMESPACE])
  }

  apply(transactionProcessRequest, context) {
    let payload = mmPayload.fromBytes(transactionProcessRequest.payload)
    let State = new MMState(context)
    let header = transactionProcessRequest.header
    let creator = header.signerPublicKey

    if (payload.Verb === 'create') {

          let properties = payload.Properties

          let createdMaterial = {
            ID: payload.ID,
            Name: properties[0],
            Group: properties[1],
            Type: properties[2],
            Status: 'ACTIVE',
            Price: properties[3],
            Cost: properties[4],
            Amount: properties[5]
          }
          
          console.log(`Submitting material with ID = ${createdMaterial.ID} for creation`)

          return State.setMaterial(createdMaterial.ID, createdMaterial)
    }else {
      throw new InvalidTransaction(
        `Action must be Create,  instead its ${payload.verb}`
      )
    } 
  }
}

module.exports = MMHandler

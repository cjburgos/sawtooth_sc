
'use strict'

const mmPayload = require('./mm_payload')
const { MM_NAMESPACE, MM_FAMILY, mmState } = require('./mm_state')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class MMHandler extends TransactionHandler {
  constructor () {
    super(MM_FAMILY, ['1.0'], [MM_NAMESPACE])
  }

  apply(transactionProcessRequest, context) {
    let payload = mmPayload.fromBytes(transactionProcessRequest.payload)
    let State = new mmState(context)
    let header = transactionProcessRequest.header
    let creator = header.signerPublicKey
    
    if (payload.Verb === 'create') {
      return State.getMaterial(payload.ID)
      .then((Material)=>{
        if(Material !== undefined){
          throw new InvalidTransaction('Invalid Action: Material already exists.')
        }
      

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
          
          console.log(`Submitting new Material with ID = ${createdMaterial.ID} for creation`)
          return State.setMaterial(createdMaterial.ID, createdMaterial)
        })
    }
    else if(payload.Verb === 'get'){
      return State.getMaterial(payload.ID)
      .then((Material)=>{
        if(Material){
          console.log(Material)
        }
        else{
          console.log('Material not found')
        }
      })
    }
    else {
      throw new InvalidTransaction(`Action must be Create,  instead its ${payload.verb}`)
    } 
  }
}

module.exports = MMHandler

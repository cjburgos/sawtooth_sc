
'use strict'

const { MM_NAMESPACE, MM_FAMILY, MMState } = require('./mm_state')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')


class MMHandler extends TransactionHandler {
  constructor () {
    super(MM_FAMILY, ['1.0'], [MM_NAMESPACE])
  }

  apply (transactionProcessRequest, context) {
    let pbuffer= transactionProcessRequest.payload
    let State = new MMState(context)
    let header = transactionProcessRequest.header
    let creator = header.signerPublicKey
    let payload = JSON.parse(pbuffer.toString('ascii',2,))

    if (payload.Verb === 'Create') {
      return State.getMaterial(payload.Name)
        .then((Material) => {
          if (Material !== undefined) {
            throw new InvalidTransaction('Invalid Action: Material already exists.')
          }

          properties = payload.Properties

          let createdMaterial = {
            ID: payload.Name,
            Name: properties[0],
            Group: properties[1],
            Type: properties[2],
            Status: 'ACTIVE',
            Price: properties[3],
            Cost: properties[4],
            Amount: properties[5]
          }

          console.log('The Material '+createdMaterial.ID+'has been created with values '+createdMaterial)

          return MMState.setMaterial(payload.ID, createdMaterial)
        })
    } else if (payload.action === 'Update') {
      return MMState.getMaterial(payload.ID)
        .then((Material) => {

          if (Material.Status == 'INACTIVE') {
            throw new InvalidTransaction('Material is currently Inactive')
          }

          if (Material === undefined) {
            throw new InvalidTransaction('Invalid Action: Update option requires an existing Material.')
          }
          if(Material.Amount < payload.Quantity){
            throw new InvalidTransaction('Not enough amount of Material')
          }
        
          Material.Amount = Material.Amount - payload.Quantity

          return MMState.setMaterial(payload.ID, Material)
        })
    } else {
      throw new InvalidTransaction(
        `Action must be Create or Update, ${payload.action}`
      )
    }
  }
}

module.exports = MMHandler

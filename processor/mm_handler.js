
'use strict'

const MMPayload = require('./mm_payload')

const { MM_NAMESPACE, MM_FAMILY, MMState } = require('./mm_state')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class MMHandler extends TransactionHandler {
  constructor () {
    super(MM_FAMILY, ['1.0'], [MM_NAMESPACE])
  }

  apply (transactionProcessRequest, context) {
    let payload = MMPayload.fromBytes(transactionProcessRequest.payload)
    let MMState = new MMState(context)
    let header = transactionProcessRequest.header
    let creator = header.signerPublicKey

    if (payload.action === 'Create') {
      return MMState.getMaterial(payload.ID)
        .then((Material) => {
          if (Material !== undefined) {
            throw new InvalidTransaction('Invalid Action: Material already exists.')
          }

          let createdMaterial = {
            ID: payload.ID,
            Name: payload.Name,
            Group: payload.Group,
            Type: payload.Type,
            Status: 'ACTIVE',
            Price: payload.Price,
            Cost: payload.Cost,
            Amount: ''
          }

          console.log('The Material '+createdMaterial.ID+'has been created with values '+createdMaterial)

          return MMState.setMaterial(payload.ID, createdGame)
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

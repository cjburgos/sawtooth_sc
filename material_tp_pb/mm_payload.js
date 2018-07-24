
'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const protos = require('./generated_protos.json')

class mmPayload {
  constructor (this,payload) {
    this.transaction = protos.SCPayload
    this.transaction.ParseFromString(payload)
    this.transaction.action
    this.transaction.timestamp 
  }

  static verifiedAction(this) {
    if(this.transaction.HasField('createMaterial') && this.transaction.action === SCPayload.CREATE_MATERIAL){
        return this.transaction.createMaterial
    }
    else{
      throw new InvalidTransaction('Action does not match payload data')
    }
  }
}

module.exports = mmPayload

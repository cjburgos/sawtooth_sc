
'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const cbor = require('cbor')

class mmPayload {
  constructor (ID, Properties, Verb) {
    this.ID = ID
    this.Properties = Properties
    this.Verb = Verb
  }

  static fromBytes(encodedPayload) {
    let payload = JSON.parse(cbor.decode(encodedPayload))
    
    if(payload.Verb === 'create'){
        if (payload) {
          let MaterialPayload = new mmPayload(payload.ID, payload.Properties, payload.Verb)

          if (!MaterialPayload.ID) {
            throw new InvalidTransaction('Material ID is required')
          }
          if (MaterialPayload.ID.indexOf('|') !== -1) {
            throw new InvalidTransaction('ID cannot contain "|"')
          }
          if (!MaterialPayload.Verb) {
            throw new InvalidTransaction('Action/Verb is required')
          }
          return MaterialPayload
        }
        else {
          throw new InvalidTransaction('Invalid payload serialization')
        }
    }
    else if(payload.Verb === 'get') {
      if (payload) {
          let MaterialPayload = new mmPayload(payload.ID,payload.Properties, payload.Verb)

          if (!MaterialPayload.ID) {
            throw new InvalidTransaction('Material ID is required')
          }
          if (!MaterialPayload.Verb) {
            throw new InvalidTransaction('Action/Verb is required')
          }
          return MaterialPayload
      }
      else {
        throw new InvalidTransaction('Invalid payload serialization')
      }
    }
    else {
      throw new InvalidTransaction('Payload Verb must be either Create or Get')
    }
  }
}

module.exports = mmPayload

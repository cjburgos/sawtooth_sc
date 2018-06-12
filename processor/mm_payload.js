
'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')


class MMPayload {
  constructor (ID, Action, Quantity) {
    this.ID = ID
    this.Action = Action
    this.Quantity = Quantity
  }

  static fromBytes() {
    payload = payload.toString().split(',')
    console.log(payload)
    if (payload.length === 3) {
      let MMPayload = new MMPayload(payload[0], payload[1], payload[2])
      if (!MMPayload.ID) {
        throw new InvalidTransaction('Material ID is required')
      }
      if (MMPayload.ID.indexOf('|') !== -1) {
        throw new InvalidTransaction('ID cannot contain "|"')
      }

      if (!MMPayload.Action) {
        throw new InvalidTransaction('Action is required')
      }
      return MMPayload
    } else {
      throw new InvalidTransaction('Invalid payload serialization')
    }
  }
}

module.exports = MMPayload

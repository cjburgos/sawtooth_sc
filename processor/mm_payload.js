/**
 * Copyright 2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class MMPayload {
  constructor (ID, Action, Quantity) {
    this.ID = ID
    this.Action = Action
    this.Quantity = Quantity
  }

  static fromBytes(payload) {
    payload = payload.toString().split(',')
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

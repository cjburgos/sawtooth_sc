/**
 * Copyright 2017 Intel Corporation
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
 * ----------------------------------------------------------------------------
 */
'use strict'

const r = require('rethinkdb')

const db = require('./')

const hasCurrentBlock = currentBlock => obj => {
  return r.and(
    obj('startBlockNum').le(currentBlock),
    obj('endBlockNum').gt(currentBlock)
  )
}
//Utility function
const getAttribute = attr => obj => obj(attr)


const getRecordId = getAttribute('material_id')
const getPublicKey = getAttribute('publicKey')
const getName = getAttribute('name')
const getReporters = getAttribute('reporters')
const getAuthorized = getAttribute('authorized')

const hasPublicKey = key => obj => {
  return r.eq(
    key,
    getPublicKey(obj)
  )
}

//Funcion que devuelve el public key de un Agent segun el Role deseado
const getAssociatedAgentId = role => record => record(role).nth(-1)('agentId')
//Devuelve el Public Key del Owner o Custodian
const getOwnerId = getAssociatedAgentId('owners')
const getCustodianId = getAssociatedAgentId('custodians')

//Devuelve el record asociado a el Public Key de un Agent
const isAssociatedWithRecord = association => agent => record => {
  return r.eq(
    association(record),
    getPublicKey(agent)
  )
}

//Devuelve el PublicKey del Owner de un Record y luego verifica si el Public del Agent haciendo el Call es igual al del Record
const isRecordOwner = isAssociatedWithRecord(getOwnerId)
//Devuelve el PublicKey del Custodian de un Record y luego verifica si el Public del Agent haciendo el Call es igual al del Record
const isRecordCustodian = isAssociatedWithRecord(getCustodianId)

const isReporter = agent => property => {
  return getReporters(property)
    .filter(hasPublicKey(getPublicKey(agent)))
    .do(seq => r.branch(
      seq.isEmpty(),
      false,
      getAuthorized(seq.nth(0))
    ))
}

const getTable = (tableName, block) =>
      r.table(tableName).filter(hasCurrentBlock(block))

const listQuery = filterQuery => block => {
  return getTable('agents', block)
    .filter(filterQuery)
    .map(agent => r.expr({
      'name': getName(agent),
      'key': getPublicKey(agent),
      'owns': getTable('records', block)
        .filter(isRecordOwner(agent))
        .map(getRecordId)
        .distinct(),
      'custodian': getTable('records', block)
        .filter(isRecordCustodian(agent))
        .map(getRecordId)
        .distinct(),
      'reports': getTable('properties', block)
        .filter(isReporter(agent))
        .map(getRecordId)
        .distinct()
    })).coerceTo('array')
}

const fetchQuery = (publicKey, auth) => block => {
  return getTable('agents', block)
    .filter(hasPublicKey(publicKey))
    .pluck('name', 'publicKey')
    .nth(0)
    .do(
      agent => {
        return r.branch(
          auth,
          agent.merge(
            fetchUser(publicKey)),
          agent)
      })
}

const fetchUser = publicKey => {
  return r.table('users')
    .filter(hasPublicKey(publicKey))
    .pluck('username', 'email', 'encryptedKey')
    .nth(0)
}

const list = filterQuery => db.queryWithCurrentBlock(listQuery(filterQuery))

const fetch = (publicKey, auth) =>
      db.queryWithCurrentBlock(fetchQuery(publicKey, auth))

module.exports = {
  list,
  fetch
}

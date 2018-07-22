
'use strict'

const _ = require('lodash')
const r = require('rethinkdb')
const db = require('./')

const addBlockState = (tableName, indexName, indexValue, doc, blockNum) => {
  return db.modifyTable(tableName, table => {
    return table
      .getAll(indexValue, { index: indexName })
      .filter({ endBlockNum: Number.MAX_SAFE_INTEGER })
      .coerceTo('array')
      .do(oldDocs => {
        return oldDocs
          .filter({ startBlockNum: blockNum })
          .coerceTo('array')
          .do(duplicates => {
            return r.branch(
              // If there are duplicates, do nothing
              duplicates.count().gt(0),
              duplicates,

              // Otherwise, update the end block on any old docs,
              // and insert the new one
              table
                .getAll(indexValue, { index: indexName })
                .update({ endBlockNum: blockNum })
                .do(() => {
                  return table.insert(_.assign({}, doc, {
                    startBlockNum: blockNum,
                    endBlockNum: Number.MAX_SAFE_INTEGER
                  }))
                })
            )
          })
      })
  })
}

const addAgent = (agent, blockNum) => {
  return addBlockState('agents', 'publicKey', agent.publicKey,
                       agent, blockNum)
}

const addMaterial= (material, blockNum) => {
  return addBlockState('materials', 'material_id', material.material_id,
                       material, blockNum)
}

const addProperty = (property, blockNum) => {
  return addBlockState('properties', 'attributes',
                       ['name', 'material_id'].map(k => property[k]),
                       property, blockNum)
}

const addPropertyPage = (page, blockNum) => {
  return addBlockState('propertyPages', 'attributes',
                       ['name', 'material_id', 'pageNum'].map(k => page[k]),
                       page, blockNum)
}

const addProposal = (proposal, blockNum) => {
  return addBlockState(
    'proposals', 'attributes',
    ['material_id', 'timestamp', 'receivingAgent', 'role'].map(k => proposal[k]),
    proposal, blockNum)
}

module.exports = {
  addAgent,
  addMaterial,
  addProperty,
  addPropertyPage,
  addProposal
}


'use strict'

const path = require('path')
const _ = require('lodash')
const protobuf = require('protobufjs')

const protos = {}

const loadProtos = (filename, protoNames) => {
  const protoPath = path.resolve(__dirname, '../protos', filename)
  return protobuf.load(protoPath)
    .then(root => {
      protoNames.forEach(name => {
        protos[name] = root.lookupType(name)
      })
    })
}

const compile = () => {
  return Promise.all([
    loadProtos('material.proto', [
      'Material',
      'MaterialContainer'
    ]),
    loadProtos('payload.proto', [
      'SCPayload',
      'CreateMaterialAction'
    ])
  ])
}


module.exports = _.assign(protos, { compile })

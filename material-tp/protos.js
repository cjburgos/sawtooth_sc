
'use strict'

const path = require('path')
const _ = require('lodash')
const protobuf = require('protobufjs')

const protos = {}

const loadProtos = (filename, protoNames) => {
  const protoPath = path.resolve(__dirname, '../../protos', filename)
  return protobuf.load(protoPath)
    .then(root => {
      protoNames.forEach(name => {
        protos[name] = root.lookupType(name)
      })
    })
}

const compile = () => {
  return Promise.all([
    loadProtos('agent.proto', [
      'Agent',
      'AgentContainer'
    ]),
    loadProtos('property.proto', [
      'Property',
      'PropertyContainer',
      'PropertyPage',
      'PropertyPageContainer',
      'PropertySchema',
      'PropertyValue',
      'Location'
    ]),
    loadProtos('material.proto', [
      'Material',
      'MaterialContainer'
    ]),
    loadProtos('payload.proto', [
      'SCPayload',
      'CreateAgentAction',
      'CreateMaterialAction'
    ])
  ])
}


module.exports = _.assign(protos, { compile })

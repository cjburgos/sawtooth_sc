
'use strict'

const _ = require('lodash')
const protobuf = require('protobufjs')

// Use the generated JSON to reference the .proto files in protos/
const protoJson = require('../generated_protos.json')

// Keys for payload actions
const ACTIONS = [
  'CREATE_MATERIAL',
]

// Create dictionary with key, enum and class names
const titleify = allCaps => {
  return allCaps
    .split('_')
    .map(word => word[0] + word.slice(1).toLowerCase())
    .join('')
}

const actionMap = ACTIONS.reduce((map, enumName) => {
  const key = enumName[0].toLowerCase() + titleify(enumName).slice(1)
  const className = titleify(enumName) + 'Action'
  return _.set(map, key, { enum: enumName, name: className })
}, {})

// Compile Protobufs
const root = protobuf.Root.fromJSON(protoJson)
const SCPayload = root.lookup('SCPayload')
_.map(actionMap, action => {
  return _.set(action, 'proto', root.lookup(action.name))
})

// Create data xforms on an action by action basis
const propertiesXformer = xform => data => {
  return _.set(data, 'properties', data.properties.map(xform))
}
const valueXform = propertiesXformer(prop => PropertyValue.create(prop))
const schemaXform = propertiesXformer(prop => {
  if (prop.locationValue) {
    prop.locationValue = Location.create(prop.locationValue)
  }
  return PropertySchema.create(prop)
})

_.map(actionMap, action => _.set(action, 'xform', x => x))
actionMap.createMaterial.xform = valueXform


/**
 * Encodes a new SCPayload with the specified action
 */
const encode = (actionKey, actionData) => {
  const action = actionMap[actionKey]
  if (!action) {
    throw new Error('There is no payload action with that key')
  }

  return SCPayload.encode({
    action: SCPayload.Action[action.enum],
    timestamp: Math.floor(Date.now() / 1000),
    [actionKey]: action.proto.create(action.xform(actionData))
  }).finish()
}

/**
 * Particular encode methods can be called directly with their key name
 * For example: payloads.createAgent({name: 'Susan'})
 */
const actionMethods = _.reduce(actionMap, (methods, value, key) => {
  return _.set(methods, key, _.partial(encode, key))
}, {})

// Add enums on an action by action basis
actionMethods.createMaterial.enum = PropertySchema.DataType


module.exports = _.assign({
  encode,
  FLOAT_PRECISION: 1000000
}, actionMethods)

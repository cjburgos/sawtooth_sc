const { EnclaveFactory } = require('./enclave')
const { SawtoothClientFactory } = require('./sawtooth-client')
const _ = require('lodash')
const env = require('./env')
const input = require('./input')
const enclave = EnclaveFactory(Buffer.from(env.privateKey, 'hex'))
const bodyParser = require('body-parser')

const MaterialClient = SawtoothClientFactory({
  enclave: enclave,
  restApiUrl: env.restApiUrl
})

const MaterialTransactor = MaterialClient.newTransactor({
  familyName: env.familyName,
  familyVersion: env.familyVersion
})

input.submitPayload(newPayload, MaterialTransactor)

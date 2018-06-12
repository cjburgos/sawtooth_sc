const { EnclaveFactory } = require('./enclave')
const { SawtoothClientFactory } = require('./sawtooth-client')
const argv = require('yargs')
  .usage('Usage: node $0 --T [string] --verb [string]')
  .choices('verb', ['Create','Update'])
  .string(['T','verb'])
  .describe('T', 'transaction object')
  .describe('verb', 'action to take on the entry')
  .wrap(null)
  .demandOption(['T','verb'])
  .help('h')
  .alias('h', 'help')
  .argv

const env = require('./env')
const input = require('./input')
const crypto = require('crypto')

const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toUpperCase().substring(0, 64)
const enclave = EnclaveFactory(Buffer.from(env.privateKey, 'hex'))

const MaterialClient = SawtoothClientFactory({
  enclave: enclave,
  restApiUrl: env.restApiUrl
})

const MaterialTransactor = MaterialClient.newTransactor({
  familyName: env.familyName,
  familyVersion: env.familyVersion
})

const T_Obj = JSON.parse(argv.T)

const newPayload = {
  Name: T_Obj.ID,
  Properties: [T_Obj.Name, T_Obj.Group, T_Obj.Type, T_Obj.Price, T_Obj.Cost, T_Obj.Amount],
  Verb: argv.verb,
}

if (input.payloadIsValid(newPayload)) {
  input.submitPayload(newPayload, MaterialTransactor)
} else {
  console.log(`Oops! Your payload failed validation and was not submitted.`)
}

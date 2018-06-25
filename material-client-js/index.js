const { EnclaveFactory } = require('./enclave')
const { SawtoothClientFactory } = require('./sawtooth-client')
const argv = require('yargs')
  .usage('Usage: node $0 --T [string] --verb [create,update]')
  .choices('verb', ['create','update'])
  .string(['T','verb'])
  .describe('T', 'the material parameters')
  .describe('verb', 'action to take on the entry')
  .example('--T "{"ID":"001","Name":"Pizza","Group":"Frozen Food","Type":"Food","Price":20,"Cost":10,"Amount":100}" --verb "Create"')
  .wrap(null)
  .demandOption(['T','verb'])
  .help('h')
  .alias('h', 'help')
  .argv

const env = require('./env')
const input = require('./input')

console.log(`Public Key is: ${env.privateKey}`)
console.log(`Private Key is: ${env.privateKey}`)

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
  ID: T_Obj.ID,
  Properties: [T_Obj.Name, T_Obj.Group, T_Obj.Type, T_Obj.Price, T_Obj.Cost, T_Obj.Amount],
  Verb: argv.verb,
}

if (input.payloadIsValid(newPayload)) {
  input.submitPayload(newPayload, MaterialTransactor)
} else {
  console.log(`Oops! Your payload failed validation and was not submitted.`)
}

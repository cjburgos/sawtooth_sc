const { EnclaveFactory } = require('./enclave')
const { SawtoothClientFactory } = require('./sawtooth-client')
const argv = require('yargs')
  .usage('Usage: node $0 --ID [string] --verb [Create,Update] --Quantity [integer]')
  .choices('verb', ['Create','Update'])
  .number('Quantity')
  .string(['verb','ID'])
  .describe('ID', 'unique identifier for the entry')
  .describe('verb', 'action to take on the entry')
  .describe('Quantity', 'value to pass to the entry')
  .example('node index.js --ID Material A --verb Action --Quantity 100')
  .wrap(null)
  .demandOption(['ID', 'verb', 'Quantity'])
  .help('h')
  .alias('h', 'help')
  .argv

const env = require('./env')
const input = require('./input')

const enclave = EnclaveFactory(Buffer.from(env.privateKey, 'hex'))

const MaterialClient = SawtoothClientFactory({
  enclave: enclave,
  restApiUrl: env.restApiUrl
})

const MaterialTransactor = MaterialClient.newTransactor({
  familyName: env.familyName,
  familyVersion: env.familyVersion
})

const newPayload = {
  Name: argv.ID,
  Verb: argv.verb,
  Value: argv.Quantity
}

console.log(newPayload)

if (input.payloadIsValid(newPayload)) {
  input.submitPayload(newPayload, MaterialTransactor)
} else {
  console.log(`Oops! Your payload failed validation and was not submitted.`)
}

const { TransactionProcessor } = require('sawtooth-sdk/processor')
const env = require('./env')
const MMHandler = require('./mm_handler')

const transactionProcessor = new TransactionProcessor(env.validatorUrl)

transactionProcessor.addHandler(new MMHandler())
transactionProcessor.start()

console.log(`Starting Material Transaction Processor`)
console.log(`Connecting to Sawtooth validator at ${env.validatorUrl}`)
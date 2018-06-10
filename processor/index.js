const { TransactionProcessor } = require('sawtooth-sdk/processor')

const MMHandler = require('./mm_handler')

const transactionProcessor = new TransactionProcessor('tcp://127.0.0.1:4004')

transactionProcessor.addHandler(new MMHandler())
transactionProcessor.start()

console.log(`Starting Material Transaction Processor`)
console.log('Connecting to Sawtooth validator at tcp://127.0.0.1:4004')
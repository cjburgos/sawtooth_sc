
const input = {
  payloadIsValid: (payload) => {
    if (verbIsValid(payload.Verb) && idIsValid(payload.ID)) return true
    else return false
  },
  submitPayload: async (payload, transactor) => {
    try {
      // Format the Sawtooth transaction
      const txn = JSON.stringify(payload)
      console.log(`Submitting transaction to Sawtooth REST API`)
      // Wait for the response from the validator receiving the transaction
      const txnRes = await transactor.post(txn)
      // Log only a few key items from the response, because it's a lot of info
      console.log({
        status: txnRes.status,
        statusText: txnRes.statusText
      })
      return txnRes
    } catch (err) {
      console.log('Error submitting transaction to Sawtooth REST API: ', err)
      console.log('Transaction: ', txn)
    }
  }
}

const verbIsValid = (verb) => {
  const trimmed = verb.trim()
  if (trimmed === 'create' || trimmed === 'get') return true
  else return false
}

const idIsValid = (ID) => {
  if (ID) return true
  else return false
}


module.exports = input



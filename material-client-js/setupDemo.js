const { EnclaveFactory } = require('./enclave')
const { SawtoothClientFactory } = require('./sawtooth-client')
const  Materials = require('./data/MaterialData.json')

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

var submitPayload = (payload) => { 
  return new Promise ((resolve,reject) =>{
    setTimeout(()=>{
      console.log('Processing Payload...')
      resolve(input.submitPayload(payload, MaterialTransactor))
    },10000);
  }); 
}

let Transaction = []

for ( Material in Materials ) {

    let M = Materials[Material]
    let Properties = []
    for(p in M){
      Properties.push(M[p])
    }

    let newPayload = {
      ID: Material,
      Properties: Properties,
      Verb: 'create'
    }

    Transactions.push(newPayload)

}

submitPayload(Transactions)
    
    // .then((resolve) => {
    //   console.log('Payload processed successfully')
    // },(reject) => {
    //   console.log('Failed to submit payload')
    // });



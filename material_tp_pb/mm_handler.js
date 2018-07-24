
'use strict'

const mmPayload = require('./mm_payload')
const { MM_NAMESPACE, MM_FAMILY, mmState } = require('./mm_state')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')


class MMHandler extends TransactionHandler {
  constructor () {
    super(MM_FAMILY, ['1.0'], [MM_NAMESPACE])
  }

  apply(transactionProcessRequest, context) {
    let State = new mmState(context);
    let header = transactionProcessRequest.header;
    let payload = mmPayload.verifiyAction(transactionProcessRequest.payload)
    var D = new Date();

    if (payload.action === 'createMaterial') {
      return State.getMaterial(payload.ID)
      .then((Material)=>{
        if(Material !== undefined){
          throw new InvalidTransaction('Invalid Action: Material already exists.')
        }

          return MaterialTemplate.create({
            material_id: payload.ID,
            material_name: properties[0],
            material_group: properties[1],
            material_type: properties[2],
            material_status: 'ACTIVE',
            material_price: properties[3],
            material_cost: properties[4],
            material_amount: properties[5],
            create_date: D.toISOString(),
            material_creator: header.signerPublicKey
          })
          .then(State.setMaterial(MaterialTemplate.material_id, MaterialTemplate.SerializeToString()))
        })
    }
    else if(payload.Verb === 'get'){
       return State.getMaterial(payload.ID).then(()=>{
            console.log(Material);
       }, (errorMessage) => {
            console.log('Material not found')
            console.log(errorMessage)
       });
    }
    else {
      throw new InvalidTransaction(`Action must be either Create or Get,  instead its ${payload.verb}`)
    } 
  }
}

module.exports = MMHandler

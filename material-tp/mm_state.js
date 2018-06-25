
'use strict'

const crypto = require('crypto')

const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toUpperCase().substring(0, 64)

const MM_FAMILY = 'material'
const MM_NAMESPACE = _hash(MM_FAMILY).substr(0,6)
const MM_VERSION = '1.0'
const _makeMMAddress = (x) => MM_NAMESPACE + _hash(x)

const _deserialize = (data) => {
  let MaterialIterable = data.split('|').map(x => x.split(','))
    .map(x => [x[0], {ID: x[0], 
                      Name: x[1], 
                      Group: x[2], 
                      Type: x[3], 
                      Status: x[4], 
                      Price: x[5], 
                      Cost: x[6], 
                      Amount: x[7]}])
  return new Map(MaterialIterable)
}

const _serialize = (Materials) => {
  let MaterialStrs = []
  for (let Material of Materials) {
    let ID = Material[0]
    let Property = Material[1]
    MaterialStrs.push([ID, Property.Name, Property.Group, Property.Type, Property.Status, Property.Price, Property.Cost, Property.Amount].join(','))
  }
  MaterialStrs.sort()
  return Buffer.from(MaterialStrs.join('|'))
}

class MMState {
    constructor(context){
        this.context = context
        this.addressCache = new Map([])
        this.timeout = 500 // Timeout in milliseconds
    }

    getMaterial(ID){
       let address = _makeMMAddress(ID)
        return this._loadMaterial(ID).then((Material)=> Material.get(ID))
    }

    setMaterial(ID, Properties){
      let address = _makeMMAddress(ID)
      return this._loadMaterial(address)
      .then((Material) => {
        Material.set(ID, Properties)
        return Material
      }).then((Material) => {
        let data = _serialize(Material)
        this.addressCache.set(address, data)
        let entries = {
          [address]: data
        }
        return this.context.setState(entries, this.timeout)
      })
    }

    _loadMaterial(address) {
        if (this.addressCache.has(address)) {
          if (this.addressCache.get(address) === null) {
            return Promise.resolve(new Map([]))
          } else {
            return Promise.resolve(_deserialize(this.addressCache.get(address)))
          }
        } else {
          return this.context.getState(address, this.timeout)
            .then((addressValues) => {
              if (!addressValues[address].toString()) {
                this.addressCache.set(address, null)
                return new Map([])
              } else {
                let data = addressValues[address].toString()
                this.addressCache.set(address, data)
                return _deserialize(data)
              }
            })
        }
    }

}

module.exports = {
  MM_NAMESPACE,
  MM_VERSION,
  MM_FAMILY,
  MMState
}








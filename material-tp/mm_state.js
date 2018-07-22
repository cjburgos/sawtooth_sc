
'use strict'

const crypto = require('crypto');

class mmState {
    constructor(context){
        this.context = context
        this.addressCache = new Map([])
        this.timeout = 500 // Timeout in milliseconds
    }

    getMaterial (id) {
      return this._loadMaterial(id).then((Material)=> Material.get(id));
    }

    setMaterial(id, Properties){
      let address = _makeMMAddress(id);

      return this._loadMaterial(id).then((Material) => {
        Material.set(id, Properties);
        return Material;
      }).then((Material) => {
        let data = _serialize(Material);

        this.addressCache.set(address, data);
        let entries = {
          [address]: data
        };
        return this.context.setState(entries, this.timeout);
      });
    }

    _loadMaterial (id) {
      let address = _makeMMAddress(id);
      if (this.addressCache.has(address)) {
        if (this.addressCache.get(address) === null) {
          return Promise.resolve(new Map([]));
        } else {
            return Promise.resolve(_deserialize(this.addressCache.get(address)));
          }
        } else {
          return this.context.getState([address], this.timeout)
            .then((addressValues) => {
              if (!addressValues[address].toString()) {
                this.addressCache.set(address, null);
                return new Map([]);
              } else {
                let data = addressValues[address].toString();
                this.addressCache.set(address, data);
                return _deserialize(data);
              }
            });
        }
    }
}

const _hash = (x) =>
  crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64);

const MM_FAMILY = 'material';

const MM_NAMESPACE = _hash(MM_FAMILY).substring(0, 6);

const _makeMMAddress = (x) => MM_NAMESPACE + _hash(x);

module.exports = {
  MM_NAMESPACE,
  MM_FAMILY,
  mmState
};

const _deserialize = (data) => {
  let mmIterable = data.split('|').map(x => x.split(','))
    .map(x => [x[0], {ID: x[0],Name: x[1],Group: x[2],Type: x[3],Status: x[4],Price: x[5],Cost: x[6],Amount: x[7], CreateDate: x[8], Creator: x[9] }]);
  return new Map(mmIterable);
};

const _serialize = (Material) => {
  let mmStrs = []
  for (let M of Material) {
    let id = M[0]
    let Property = M[1]
    mmStrs.push([id, Property.Name, Property.Group, Property.Type, Property.Status, Property.Price, Property.Cost, Property.Amount, Property.CreateDate, Property.Creator].join(','));
  }
  
  mmStrs.sort();

  return Buffer.from(mmStrs.join('|'))
}





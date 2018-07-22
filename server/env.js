
const dotenv = require('dotenv')
const  Materials = require('../material-client-js/data/MaterialData.json')

dotenv.config()

const env = {
  DATA: process.env.DATA || Materials
}

console.log(env)

module.exports = env
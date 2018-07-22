
const dotenv = require('dotenv')

dotenv.config()

const env = {
  validatorUrl: process.env.VALIDATOR_URL || 'tcp://35.190.164.236:4004'
}

console.log(env)

module.exports = env
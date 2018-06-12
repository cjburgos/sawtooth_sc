
const dotenv = require('dotenv')

dotenv.config()

const env = {
  validatorUrl: process.env.VALIDATOR_URL || 'tcp://127.0.0.1:4004'
}

console.log(env)

module.exports = env
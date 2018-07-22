/**
 * Copyright 2017 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------------
 */
'use strict'

const express = require('express')
const db = require('./db')
// const blockchain = require('./blockchain')
// const api = require('./api')
const config = require('./system/config')

const PORT = config.PORT
const app = express()

// const {CreateMaterial} = require('./scripts/seed_sample_data')
// const { Materials } = require('../material-client-js/data/MaterialData.json')

// var MaterialCount = Object.keys(Materials).length -1;

// console.log(MaterialCount);

// for ( var i = 0 ; MaterialCount ; i++ ) {

//   console.log(`The value of i is ${i}`)

//   let ID = Materials[i].ID
//   let Properties = Materials[i].Properties
//   CreateMaterial(ID,Properties)
// }

Promise.all([
  db.connect(),
  // blockchain.connect()
])
  .then(() => {
    app.use('/', api)
    app.listen(PORT, () => {
      console.log(`Supply Chain Server listening on port ${PORT}`)
    })
  })
  .catch(err => console.error(err.message))
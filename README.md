# **Material Transaction Processor**

## Overview

A transaction processor module for asset creation using Hyperledger Sawtooth blockchain network. 

## Transaction Processor Set-Up

First, bring up the network using the following command:

`$ sudo docker-compose up`

Docker images will be downloaded to create the required containers to build the network. 

The network is composed by the following containers:

**1. settings-tp**\
  The Settings Transaction Processor that allows a sysadmin to create proposal request to change settings within the Validators network

**2. intkey-tp-python**\
  An implementation of the "intkey" sample transaction processor built in Python.

**3. xo-tp-python**\
  An implementation of the "xo" sample transaction processor built in Python.

**4. Validator**\
  Sawtooth-Validator container

**5. REST-API**\
  A REST-API container that routes Client's Transaction Request submissions to the Validator and to the corresponding Transaction Handler

**6. SHELL**\
  A shell container to access the Validator

Once the it finishes downloading the images and starting the network,
open a new terminal window. Navigate to the Processor folder, and execute the following commands:

`$ cd Processor`

`$ npm install`

`$ node index.js`

You should see the following message:

```
Starting Material Transaction Processor
Connecting to Sawtooth validator at XXX.XXX.XXX.XXX...
Registered...
```

## Client Set-Up

After the registration of the Material Transaction processor is completed, navigate to the material-client-js folder and execute the following commands:

`cd material-client-js`

`$ npm install`

After the installation is completed, you can use the following command to submit transactions:

`$ node index.js --T [string] --Verb [ Create | Update ]`

The --T argument will receive an object, in the form of a string,that will contain the properties required to create/update the Material. The properties are:

- **ID:** the Material's ID (i.e. 001)
- **Name:** the Material's name (i.e. Pizza)
- **Group:** the Material's group (i.e. Frozen Food)
- **Type:** the Material's type (i.e. Foods)
- **Price:** the Material's price *Must be an integer (do not use '')
- **Cost:** the Material's cost *Must be an integer (do not use '')

## References

**Hyperledger Sawtooth v1.0.4 Documentation**\(https://sawtooth.hyperledger.org/docs/core/releases/1.0/introduction.html)


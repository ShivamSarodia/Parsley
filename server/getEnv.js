'use strict'

const fs = require('fs')

const dotEnvExists = fs.existsSync('.env')
if (dotEnvExists) {
  console.log('getEnv.js: .env exists, probably running on development environment')
  process.exit()
}

// On Google Cloud Platform authentication is handled for us
const {Storage} = require('@google-cloud/storage')

const storage = new Storage();
storage.getBuckets()
  .then(([buckets]) => {
    for(let bucket of buckets) {
      if(bucket.name.startsWith("envvars-")) {
        return bucket
      }
    }
  })
  .then((bucket) => {
    console.log(`Downloading .env from bucket "${bucket.name}"`)
    return bucket
      .file('.env')
      .download({ destination: '.env' })
      .then(() => {
        console.info('getEnv.js: .env downloaded successfully')
      });
  })
  .catch(e => {
    console.error(`getEnv.js: There was an error: ${JSON.stringify(e, undefined, 2)}`)
    process.exit(1);
  });
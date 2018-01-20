// Imports
const index = require('./lib/indexer');
const db = require('./lib/db');
const config = require('../config.json');
const express = require('express');

var helmet = require('helmet');

// Set up express app
const app = express();
app.enable('trust proxy');

// Set up middlewares
app.use(helmet());
app.use(new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
}));

(async () => {

  // Initial index and storage
  await indexAndStore();

  // Store the organization on hour intervals
  setInterval(async () => await indexAndStore(), 1000 * 60 * 60 * config.indexInterval);
})();

/**
 * Index GH api and store to DB
 */
async function indexAndStore() {
  let organization;

  // Index organization
  try {
    organization = await index(config);
  } catch(e) {}

  // Store it in the db
  (organization) && (db.update(organization));
}

// Return whole DB on root
app.get('/', (req, res) => res.send( JSON.stringify(db.getdb()) ));
app.listen(6253, () => console.log('Indexer listening'));

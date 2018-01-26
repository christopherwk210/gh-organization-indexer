// Imports
const fs = require('fs');
const path = require('path');
const util = require('util');

let db;

// DB path
const filePath = path.join(__dirname, '../../db/org.json');

// Promisfy fs functions
fsExists = util.promisify(fs.exists);
fsWriteFile = util.promisify(fs.writeFile);
fsMkdir = util.promisify(fs.mkdir);
fsReadFile = util.promisify(fs.readFile);
fsWriteFile = util.promisify(fs.writeFile);

// Load DB
(async () => {

  // Directory existence check
  let dirExists = await fsExists(path.dirname(filePath));

  // Create directory if not present
  if (!dirExists) {
    await fsMkdir(path.dirname(filePath));
  }

  // DB existence check
  let exists = await fsExists(filePath);

  // Create DB if not present
  if (!exists) {
    await fsWriteFile(filePath, '{}', { encoding: 'utf8' });
    db = {};
  } else {
    db = await fsReadFile(filePath, 'utf8');
    db = JSON.parse(db);
  }
})();

/**
 * Save DB to disk
 */
async function writeDB() {
  await fsWriteFile(filePath, JSON.stringify(db), { encoding: 'utf8' });
}

/**
 * Update in-memory DB and saves to disk
 */
async function update(org) {

  // Save organization info
  db.info = org.info.data;

  // Save orgnanization members
  db.members = org.members.data;

  // Store repos
  db.repos = org.repos;

  // Store DB
  await writeDB();
}

/**
 * Returns copy of in-memory db
 */
function getdb() {
  return {...db};
}

module.exports = {
  update: update,
  getdb: getdb
};

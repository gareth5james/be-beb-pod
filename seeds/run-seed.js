const data = require("../db/data/index.js");
const seed = require("./seed.js");
const db = require("../db/connection.js");

const runSeed = () => {
  return seed(data).then(() => db.end());
};

runSeed();

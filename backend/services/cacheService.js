const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // 5 min TTL

const get = (key) => cache.get(key);
const set = (key, value) => cache.set(key, value);
const del = (key) => cache.del(key);

module.exports = { get, set, del };

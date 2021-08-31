const dotenv = require('dotenv');

dotenv.config();

const { NODE_ENV, MONGO_URI, PORT } = process.env;

const config = {
    NODE_ENV: NODE_ENV || 'dev',
    MONGO_URI: MONGO_URI || 'mongodb://localhost:27017/Radio',
    PORT: PORT || 4000,
}

function get(key) {
    return config[key.toUpperCase()];
}

module.exports = {get };
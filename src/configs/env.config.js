const dotenv = require('dotenv');

dotenv.config();

const { CLIENT_URL, NODE_ENV, MONGO_URI, PORT, BASE_URL, AUTH0_DOMAIN, CLIENT_ID, YOUTUBE_API_URL } = process.env;

const config = {
    NODE_ENV: NODE_ENV || 'dev',
    MONGO_URI: MONGO_URI || 'mongodb://localhost:27017/Radio',
    PORT: PORT || 4000,
    BASE_URL: BASE_URL || `http://localhost:${PORT || 4000}`,
    AUTH0_DOMAIN: AUTH0_DOMAIN || 'test',
    CLIENT_ID: CLIENT_ID || 'test',
    CLIENT_URL: CLIENT_URL || 'http://localhost:3001',
    YOUTUBE_API_URL
}

function get(key) {
    return config[key.toUpperCase()];
}

module.exports = {get };
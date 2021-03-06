const path = require('path');

const VENTI_PATH = path.resolve(__dirname, '../');
const PROJECT_PATH = process.cwd();
const PROJECT_NODE_VERSION = process.version;
const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 8888;
const NPM_VERSION_URL = 'https://registry.npmjs.org/@ventii/cli/latest';

const TEMPLATES = [
  'venti-template'
];

const GITHUB = {
  host: 'github.com/mochen0505'
}

module.exports = {
    VENTI_PATH,
    PROJECT_PATH,
    PROJECT_NODE_VERSION,
    SERVER_HOST,
    SERVER_PORT,
    NPM_VERSION_URL,
    TEMPLATES,
    GITHUB,
}

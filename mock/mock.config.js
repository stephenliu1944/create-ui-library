var pkg = require('../package.json');

const { server } = pkg.devEnvironments;

module.exports = {
    port: server.mock
};
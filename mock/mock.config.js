var pkg = require('../package.json');

const { servers } = pkg.devEnvironments;

module.exports = {
    port: servers.mock
};
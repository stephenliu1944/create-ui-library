// server.js
var jsonServer = require('json-server');
var pkg = require('../package.json');

const server = jsonServer.create();
const router = jsonServer.router('mock-server/data/db.json');
const middlewares = jsonServer.defaults();
var { mock } = pkg.devServer;
var port = mock.match(/\d+$/)[0];

server.use(middlewares);
server.use(router);
server.listen(port, () => {
    console.log('JSON Server is running');
});
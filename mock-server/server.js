// server.js
var jsonServer = require('json-server');
var pkg = require('../package.json');

const server = jsonServer.create();
const router = jsonServer.router('mock-server/data/db.json');
const middlewares = jsonServer.defaults();
var { port } = pkg.mockServer;

server.use(middlewares);
server.use(router);
server.listen(port, () => {
    console.log('JSON Server is running');
});
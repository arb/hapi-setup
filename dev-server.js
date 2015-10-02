var Assert = require('assert');
var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({ port: 8888 });

server.register([{
  register: require('./lib'),
  options: {
    endpoint: '/foobar'
  }
},
require('inert'),
require('vision')], function (err) {
  Assert.ifError(err);

  server.start(function () {
    console.log('Server started at ' + server.info.uri);
  });
});

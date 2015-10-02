'use strict';
var Hoek = require('hoek');
var Path = require('path');

var setup = require('./setup');
var defaults = {
  endpoint: '/setup',
  ui: true,
  auth: false
};

module.exports.register = function (server, options, next) {
  var settings = Hoek.applyToDefaults(defaults, options);

  server.expose('setup', function () {
    return setup(server);
  });

  if (settings.ui) {
    server.dependency(['inert', 'vision'], buildUi(settings));
  }

  return next();
};

module.exports.register.attributes = {
  pkg: require('../package.json')
};

var buildUi = function (settings) {
  return function (server, next) {
    server.views({
      engines: {
        jade: require('jade')
      },
      path: Path.resolve('./assets/views'),
      // only need this during dev mode
      isCached: false
    });

    server.route([{
      method: 'GET',
      path: settings.endpoint,
      handler: function (request, reply) {
        var data = setup(request.server);
        reply.view('index', data);
      },
      config: {
        auth: settings.auth
      }
    }, {
      method: 'GET',
      path: '/public/styles.css',
      handler: {
        file: Path.resolve('./build/styles.css')
      },
      config: {
        auth: settings.auth
      }
    }]);

    return next();
  };
};

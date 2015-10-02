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
    server.dependency(['inert'], buildUi(settings));
  }

  return next();
};

module.exports.register.attributes = {
  pkg: require('../package.json')
};

var buildUi = function (settings) {
  return function (server, next) {
    server.route([{
      method: 'GET',
      path: settings.endpoint,
      handler: {
        file: Path.resolve(process.cwd(), 'build', 'index.html')
      },
      config: {
        auth: settings.auth
      }
    }, {
      method: 'GET',
      path: '/public/main.js',
      handler: {
        file: Path.resolve(process.cwd(), 'build', 'main.js')
      },
      config: {
        auth: settings.auth
      }
    }]);

    return next();
  };
};

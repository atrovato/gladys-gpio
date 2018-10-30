const watch = require('./watchDevice.js');
const queries = require('./queries.js');
const Promise = require('bluebird');

/**
 * Looks for existing compatible devices
 * and for each, updates the value.
 */
module.exports = function() {
  return gladys.utils.sql(queries.getDeviceByService, [ 'gpio-sensor' ])
    .then((devices) => {
      return Promise.map(devices, function(device) {
        return watch(device);
      });
    });
};

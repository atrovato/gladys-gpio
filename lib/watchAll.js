const watch = require('./watchDevice.js');
const Promise = require('bluebird');

/**
 * Looks for existing compatible devices
 * and for each, updates the value.
 */
module.exports = function() {
  return gladys.device.getByService({ service: 'gpio' })
    .then((devices) => {
      return Promise.map(devices, function(device) {
        return watch(device);
      });
    }).catch((e) => {
      console.error('Error with GPIO sensors :', e);
      return e;
    });
};

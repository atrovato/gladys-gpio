const catalogByType = require('./catalogByType.js');
const catalog = require('./catalog.js');
const Promise = require('bluebird');

/**
 * Looks for existing devices and completes it
 * with missing device types
 * according to the 'catalog.js'.
 */
module.exports = function() {
  // Search for available devices
  return gladys.device.getByService({ service: 'gpio-sensor' })
    .then((devices) => {
      return Promise.map(devices, function(device) {
        // Check if device is awaited
        var expectedTypes = catalogByType(device.protocol);
        if (expectedTypes.size == 0) {
          return Promise.reject('No sensor available for ' + device.protocol);
        } else if (!catalog.allRequired) {
          return Promise.resolve('Please set manually your device types');
        } else {
          // Gets existing related device types
          return gladys.deviceType.getByDevice(device)
            .then((devicetypes) => {
              // Check if device types exist
              var nbDeviceType = devicetypes.length;
              var indexDeviceType = 0;

              if (nbDeviceType > 0) {
                // Detects only missing sensors
                do {
                  var deviceType = devicetypes[indexDeviceType].type;
                  indexDeviceType++;

                  if (expectedTypes.has(deviceType)) {
                    expectedTypes.delete(deviceType);
                  }
                } while (indexDeviceType < nbDeviceType && expectedTypes.size > 0);
              }

              // Device type creation
              return Promise.map(expectedTypes.values(), function(expectedType) {
                expectedType.device = device.id;
                return gladys.deviceType.create(expectedType);
              });
            });
        }
      });
    });
};

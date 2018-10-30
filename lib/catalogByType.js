const catalog = require('./catalog.js');

module.exports = function (sensor) {
  var devices = catalog[sensor];
  var types = new Map();
  if (devices) {
    if (!devices.allRequired) {
      devices = { ...devices, deviceTypes: generateDeviceType(devices.nbDeviceTypes) };
    }

    devices.deviceTypes.forEach(function (device) {
      types.set(device.type, device);
    });
  }
  return types;
};

const generateDeviceType = function (nbDevices) {
  var result = [];
  for (var i = 0; i < nbDevices; i++) {
    result.push({ identifier: i.toString() });
  }
  return result;
};

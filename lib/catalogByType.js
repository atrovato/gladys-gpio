const catalog = require('./catalog.js');

module.exports = function(sensor) {
    var devices = catalog[sensor];
    var types = new Map();
    if (devices) {
        devices.forEach(function(device) {
            types.set(device.type, device);
        });
    }
    return types;
};

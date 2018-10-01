const watch = require('./watchDevice.js');

module.exports = function() {
    return gladys.utils.sql(queries.getDeviceByService, [ 'gpio-sensor' ])
            .then((devices) => {
                return Promise.map(devices, function(device) {
                    return watch(device);
                });
            });
};

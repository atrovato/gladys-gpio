const queries = require('./queries.js');
const catalogByType = require('./catalogByType.js');
const Promise = require('bluebird');

/**
 * Checks device type availability
 * then reads value from related sensor
 * and saves new device state.
 */
module.exports = function(device) {
    if (!device) {
        return Promise.reject('Device is mandatory');
    }

    var sensorType = device.protocol;
    var expectedTypes = catalogByType(sensorType);
    if (expectedTypes.size == 0) {
        return Promise.reject('No sensor available for ' + sensorType);
    }

    var sensorType = device.protocol;
    return gladys.deviceType.getByDevice(device)
        .then((deviceTypes) => {
            // Check if device types exist
            var nbDeviceType = deviceTypes.length;
            var nbAvailableDeviceType = 0;

            var availableDeviceTypes = [];
            deviceTypes.forEach(function (deviceType) {
                if (expectedTypes.has(deviceType.type)) {
                    availableDeviceTypes[deviceType.type] = deviceType;
                    nbAvailableDeviceType++;
                }
            });

            if (nbAvailableDeviceType == 0) {
                return Promise.reject('Missing device types for ' + sensorType);
            }

            var sensor = require('./sensors/' + sensorType + '.js');
            return sensor(device.identifier)
                .then((value) => {
                    console.log('Read GPIO value=', value, 'for', sensorType);
                    expectedTypes.values().forEach(function(catalogDevice) {
                        deviceStates.push({
                            value: value[device.type],
                            datetime: currentDate,
                            devicetype: availableDeviceTypes[device.type].id
                        });
                    });

                    console.log(deviceStates);
                    return Promise.map(deviceStates, function(state) {
                        return gladys.deviceState.create(state);
                    });
                }).catch((reject) => {
                    return Promise.resolve(reject);
                });
        });
};

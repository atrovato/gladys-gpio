const queries = require('./queries.js');
const GrovePi = require('node-grovepi').GrovePi
const Promise = require('bluebird');

module.exports = function(device) {
    if (!device) {
        return Promise.reject('Device is mandatory');
    }

    var expectedTypes = catalog.findByType(sensorType);
    if (!expectedTypes) {
        return Promise.reject('No sensor available for ' + sensorType);
    }

    var sensorType = device.protocol;
    return gladys.deviceType.getByDevice(device)
        .then((deviceTypes) => {
            // Check if device types exist
            var nbDeviceType = devicetypes.length;
            var indexDeviceType = 0;

            var availableDeviceTypes = [];
            devicetypes.forEach(function (deviceType) => {
                if (expectedTypes[deviceType.type]) {
                    availableDeviceTypes[deviceType.type] = deviceType;
                }
            });

            if (availableDeviceTypes.length != expectedTypes.length) {
                return Promise.reject('Missing device types for ' + sensorType);
            }

            var SensorClass = GrovePi.sensors[sensorType];
            if (!SensorClass) {
                return Promise.reject('Missing implementation for ' + sensorType);
            } else {
                var sensor = new SensorClass(device.identifier);
                var value = sensor.read();
                var deviceStates = [];
                var currentDate = new Date();
                var i = 0;

                catalog.all(sensorType).forEach(function(device) {
                    deviceStates.push({
                        value: value[i++];
                        datetime: currentDate,
                        devicetype: availableDeviceTypes[device.type].id
                    });
                });
                
                return Promise.map(deviceStates, function(state) {
                    return gladys.deviceState.create(state);
                });
            }
        });
};

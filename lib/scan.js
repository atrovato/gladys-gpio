const queries = require('./queries.js');
const sensor = require('node-dht-sensor');
const Promise = require('bluebird');
const temperature_type = 'temperature';
const humidity_type = 'humidity';

module.exports = function() {
    // Search for available devices
    return gladys.utils.sql(queries.getDeviceByService, [ 'dht-sensor' ])
        .then((devices) => {
            return Promise.map(devices, function(device) {
                // Gets existing related device types
                return gladys.deviceType.getByDevice(device)
                    .then((devicetypes) => {
                        // Check if temperature and/or humidity sensor exists
                        var nbDeviceType = devicetypes.length;
                        var indexDeviceType = 0;
                        var availableDeviceTypes = [];

                        if (nbDeviceType > 0) {
                            do {
                                var deviceType = devicetypes[indexDeviceType];
                                indexDeviceType++;
                                if (deviceType.type == temperature_type) {
                                    availableDeviceTypes[temperature_type] = deviceType;
                                } else if (deviceType.type == humidity_type) {
                                    availableDeviceTypes[humidity_type] = deviceType;
                                }
                            } while (indexDeviceType < nbDeviceType &&
                                (availableDeviceTypes[temperature_type] === undefined
                                || availableDeviceTypes[humidity_type] === undefined));
                        }

                        var deviceTypesCreation = [];
                        if (availableDeviceTypes[temperature_type] === undefined) {
                            deviceTypesCreation.push({
                                type : temperature_type,
                                identifier : temperature_type,
                                sensor : true,
                                min : -100,
                                max : 100,
                                unit : '°C',
                                device: device.id
                            });
                        }

                        if (availableDeviceTypes[humidity_type] === undefined) {
                            deviceTypesCreation.push({
                                type : humidity_type,
                                identifier : humidity_type,
                                sensor : true,
                                min : 0,
                                max : 100,
                                unit : '%',
                                device: device.id
                            });
                        }

                        Promise.map(deviceTypesCreation, function(deviceTypeCreation) {
                            return gladys.deviceType.create(deviceTypeCreation);
                        }).then((deviceTypesCreated) => {
                            var nbCreated = deviceTypesCreated.length;
                            if (nbCreated > 0) {
                                console.log(nbCreated + ' new device types created');
                            }
                            deviceTypesCreated.forEach(function(created) {
                                availableDeviceTypes[deviceTypesCreated.type] = created;
                            });
                            return Promise.resolve([device, availableDeviceTypes]);
                        }).then((data) => {
                            var device = data[0];
                            var deviceTypes = data[1];
                            var sensorType = parseInt(device.protocol.replace('DHT', ''));
                            console.log('Reading ' + device.protocol + ' sensor...');
                            sensor.read(sensorType, device.identifier, function(err, temperature, humidity) {
                                if (err) {
                                    return Promise.reject(err);
                                } else {
                                    var deviceStates = [];
                                    // Temperature
                                    deviceStates.push({
                                        value: temperature.toFixed(1),
                                        datetime: new Date(),
                                        devicetype: deviceTypes[temperature_type].id
                                    });
                                    // Humidity
                                    deviceStates.push({
                                        value: humidity.toFixed(1),
                                        datetime: new Date(),
                                        devicetype: deviceTypes[humidity_type].id
                                    });
                                    return Promise.map(deviceStates, function(state) {
                                        return gladys.deviceState.create(state);
                                    });
                                }
                            });
                        });
                });
            });
        });
};

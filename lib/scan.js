const sensor = require('node-dht-sensor');
const Promise = require('bluebird');
const temperatureType = 'temperature';
const humidityType = 'humidity';

module.exports = function() {
  // Search for available devices
  return gladys.device.getByService({ service: 'gpio-sensor' })
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
                if (deviceType.type == temperatureType) {
                  availableDeviceTypes[temperatureType] = deviceType;
                } else if (deviceType.type == humidityType) {
                  availableDeviceTypes[humidityType] = deviceType;
                }
              } while (indexDeviceType < nbDeviceType &&
                                (availableDeviceTypes[temperatureType] === undefined
                                || availableDeviceTypes[humidityType] === undefined));
            }

            var deviceTypesCreation = [];
            if (availableDeviceTypes[temperatureType] === undefined) {
              deviceTypesCreation.push({
                type : temperatureType,
                identifier : temperatureType,
                sensor : true,
                min : -100,
                max : 100,
                unit : '�C',
                device: device.id
              });
            }

            if (availableDeviceTypes[humidityType] === undefined) {
              deviceTypesCreation.push({
                type : humidityType,
                identifier : humidityType,
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
                    devicetype: deviceTypes[temperatureType].id
                  });
                  // Humidity
                  deviceStates.push({
                    value: humidity.toFixed(1),
                    datetime: new Date(),
                    devicetype: deviceTypes[humidityType].id
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

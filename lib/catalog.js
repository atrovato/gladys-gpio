module.exports = {
  'BinaryActuator': {
    allRequired: false,
    deviceTypes: [
      {
        type: 'binary',
        sensor: false,
        min: 0,
        max: 1
      }
    ]
  },
  'BinarySensor': {
    allRequired: true,
    deviceTypes: [
      {
        type: 'value',
        identifier: 'sensor',
        sensor: true,
        min: 0,
        max: 1
      }
    ]
  },
  'DHT11Sensor': {
    allRequired: true,
    deviceTypes: [
      {
        type: 'value',
        identifier: 'temperature',
        sensor: true,
        min: 0,
        max: 50,
        unit: '\u00B0C'
      }, {
        type: 'value',
        identifier: 'humidity',
        sensor: true,
        min: 20,
        max: 90,
        unit: '%'
      }
    ]
  },
  'MCP3008': {
    allRequired: false,
    nbDeviceTypes: 8
  }
};
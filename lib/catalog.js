module.exports = {
  'DHT11Sensor' : {
    allRequired: true,
    deviceTypes : [
      {
        type : 'temperature',
        identifier : 'temperature',
        sensor : true,
        min : 0,
        max : 50,
        unit : '\u00B0C'
      }, {
        type : 'humidity',
        identifier : 'humidity',
        sensor : true,
        min : 20,
        max : 90,
        unit : '%'
      }
    ]
  },
  'MCP3008' : {
    allRequired: false,
    deviceTypes: [
      {
        type : 'light_resistor',
        name : 'light sensor',
        sensor : true,
        min : 0,
        max : 540,
        unit : 'nm'
      }
    ]
  }
};
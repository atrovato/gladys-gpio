module.exports = {
  'DHT11Sensor' : [ 
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
  ],
  'LightAnalog' : [
    {
      type : 'light_resistor',
      identifier : 'light_resistor',
      name : 'light sensor',
      sensor : true,
      min : 0,
      max : 540,
      unit : 'nm'
    }
  ]
};
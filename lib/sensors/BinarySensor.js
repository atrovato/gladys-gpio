const rpio = require('rpio');
const Promise = require('bluebird');

/**
 * Binary sensor.
 */
module.exports = function (pin) {
  try {
    rpio.open(pin, rpio.INPUT);
    var result = rpio.read(pin);
    return Promise.resolve({ sensor: result });
  } catch (e) {
    return Promise.reject('BinarySensor on pin ' + pin + ' is not well configured : ' + e);
  }
};

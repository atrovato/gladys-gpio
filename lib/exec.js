const rpio = require('rpio');
const Promise = require('bluebird');

/**
 * Send binary to GPIO.
 */
module.exports = function(deviceInfo) {
  try {
    let pin = deviceInfo.deviceType.deviceTypeIdentifier;
    let value = deviceInfo.state.value === 0 ? rpio.LOW : rpio.HIGH;
    rpio.open(pin, rpio.OUTPUT);
    rpio.write(pin, value);
    rpio.close(pin, rpio.PIN_PRESERVE);
    return Promise.resolve(value);
  } catch (e) {
    return Promise.reject('BinarySensor on pin ' + pin + ' is not well configured : ' + e);
  }
};

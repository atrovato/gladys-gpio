const rpio = require('rpio');
const Promise = require('bluebird');

/**
 * DHT11 sensor.
 */
module.exports = function(pin) {
  var data = new Array(40);
  var buf = new Buffer(100000);
  var i;

  /*
     * Initiate the MCU sequence.
     */
  rpio.open(pin, rpio.OUTPUT, rpio.PULL_UP);
  rpio.sleep(1);
  rpio.write(pin, rpio.HIGH);
  rpio.usleep(10);
  rpio.write(pin, rpio.LOW);

  /*
     * The datasheet says 18us, but we need to account for the JavaScript function
     * call overhead.  Trial and error suggests this is a working value.
     */
  rpio.msleep(20);
  rpio.write(pin, rpio.HIGH);

  /*
     * Switch to input mode and read as fast as possible into our buffer.
     */
  rpio.mode(pin, rpio.INPUT);
  rpio.usleep(100);
  rpio.readbuf(pin, buf);
  rpio.close(pin);

  /*
     * Parse the buffer for lengths of each high section.  The length determines
     * whether it's a low, high, or control bit.
     */
  var tmp = new Array(buf.length); /* 0.8 compat */
  for (i = 0; i < buf.length; i++) {
    /* Convert buffer to array for node.js 0.8 compat */
    tmp[i] = buf[i];
  }
  i = 0;
  tmp.join('').replace(/0+/g, '0').split('0').forEach(function(bits) {
    /*
         * These are magic numbers.  If they don't work then uncomment this
         * line instead, it should give you the rough numbers required to
         * differentiate 0's and 1's.
         *
         * console.log(bits.length);
         */
    if (bits.length > 320) {
      return;
    }
    data[i++] = (bits.length > 150) ? 1 : 0;
  });

  /*
     * Pull out the individual value octets
     */
  var humidityInt = parseInt(data.slice(0, 8).join(''), 2);
  var humidityDec = parseInt(data.slice(8, 16).join(''), 2);
  var temperatureInt = parseInt(data.slice(16, 24).join(''), 2);
  var temperatureDec = parseInt(data.slice(24, 32).join(''), 2);
  var chksum = parseInt(data.slice(32, 40).join(''), 2);

  /* chksum should match this calculation */
  var chk = ((humidityInt + humidityDec + temperatureInt + temperatureDec) & 0xFF);

  /* Sometimes the checksum will be correct but the values obviously wrong. */
  if (chksum == chk && humidityInt <= 100) {
    var tm = parseFloat(temperatureInt + '.' + temperatureDec);
    var rh = parseFloat(humidityInt + '.' + humidityDec);
    return Promise.resolve({ temperature: tm, humidity: rh});
  } else {
    return Promise.reject('DHT11Sensor :invalid checksum');
  }
};

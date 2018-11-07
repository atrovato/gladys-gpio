const spi = require('spi');
const McpAdc = require('mcp-adc');
const Promise = require('bluebird');
const nbChannels = 8;

/**
 * MCP3008 analog to digital converter.
 * 
 * @param {string} spidev The spidev input (see ls /dev/spi*).
 */
module.exports = function (spidev) {
  try {
    const spiConfig = new spi.Spi(spidev, [], function (s) {
      s.open();
    });
    const mcp3008 = new McpAdc.Mcp3008({
      spi: spiConfig
    });
    var response = {};
    for (var channel = 0; channel < nbChannels; channel++) {
      mcp3008.readRawValue(channel, function (value) {
        response[channel] = value;
      });
    }
    return Promise.resolve(response);
  } catch (e) {
    return Promise.reject('MCP3008 is not well configured : ' + e);
  }
};

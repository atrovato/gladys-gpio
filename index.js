const watch = require('./lib/watchAll.js');
const setup = require('./lib/setup.js');

module.exports = function(sails) {
  gladys.on('ready', function() {
    // Read devices every 10 seconds
    setInterval(watch, 10000);
  });

  return {
    setup: setup
  };
};
const watch = require('./lib/watchAll.js');
const setup = require('./lib/setup.js');
const exec = require('./lib/exec.js');

module.exports = function(sails) {
  gladys.on('ready', function() {
    // Read devices every 10 seconds
    setInterval(watch, 1000);
  });

  return {
    exec: exec,
    setup: setup
  };
};
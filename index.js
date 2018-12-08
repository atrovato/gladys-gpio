const watch = require('./lib/watchAll.js');
const setup = require('./lib/setup.js');
const exec = require('./lib/exec.js');
const Promise = require('bluebird');

module.exports = function(sails) {
  gladys.on('ready', function() {
    watchWithInterval();
  });

  return {
    exec: exec,
    setup: setup
  };
};

function watchWithInterval() {
  // Read devices every second
  new Promise(watch).finally(() => {
    setTimeout(watchWithInterval, 1000);
  });
}
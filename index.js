const watch = require('./lib/watchAll.js');
const setup = require('./lib/setup.js');
const exec = require('./lib/exec.js');

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
  watch().then(function() {
    console.log('watch done, ready to run again');
    setTimeout(watchWithInterval, 1000);
  }).catch(function() {
    console.log('watch rejected, ready to run again');
    setTimeout(watchWithInterval, 1000);
  });
}
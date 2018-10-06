const watch = require('./lib/watchAll.js');
const setup = require('./lib/install.js');

module.exports = function(sails) {
    gladys.on('ready', function() {
        console.log('GPIO scanner available');
        // Read devices every 10 seconds
        setInterval(watch, 10000);
    });

    return {
        setup: setup
    };
};
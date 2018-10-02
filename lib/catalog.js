module.exports = function() {
    var catalog = {
        'DHTDigital' : [ 
            {
                type : 'temperature',
                identifier : 'temperature',
                sensor : true,
                min : -100,
                max : 100,
                unit : '°C'
            }, {
                type : 'humidity',
                identifier : 'humidity',
                sensor : true,
                min : 0,
                max : 100,
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
                max : 1000,
                unit : 'nm'
            }
        ]
    };

    return {
        all : function(sensor) {
            return catalog[sensor];
        },
        findByType : function(sensor) {
            var devices = catalog[sensor];
            var types = new Map();
            if (devices) {
                devices.forEach(function(device) {
                    types.set(device.type, device);
                });
            }
            return types;
        }
    };
};

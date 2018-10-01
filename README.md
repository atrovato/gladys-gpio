# gladys-dht-sensor
Collects data form DHT11 or DHT22 Temperatur and Humidity sensors into Gladys

## Installation
This module depends on [BCM2835](http://www.airspayce.com/mikem/bcm2835/) library that must be installed on your board before you can actually use this module.

Please see [node-dht-sensor](https://www.npmjs.com/package/node-dht-sensor) for GPIO/PIN connection.

When BCM2835 is installed and sensor connected, add a new device from Gladys page with following information :
 * Identifier : the PIN identification number
 * Protocol : DHT11 or DHT22 according to your device
 * Service : dht-sensor
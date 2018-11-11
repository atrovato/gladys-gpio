# gladys-gpio
Control GPIO actuators and sensors into Gladys


## Installation
Add a new device into Gladys according to the type of GPIO connected device.
The pin number is related to the BOARD numbering.
See intructions bellow.

### BinaryActuator
Device information :
 * Identifier : the PIN identification number
 * Protocol : BinaryActuator
 * Service : gpio

Create a sub-device type with type as 'binary'.

Now you can send 0 or 1 to the device connected on the GPIO pin.

### BinarySensor
Device information :
 * Identifier : the PIN identification number
 * Protocol : BinarySensor
 * Service : gpio

Create a sub-device type with identifier as 'sensor'.

Now you can read 0 or 1 from the device connected on the GPIO pin.

### DHTSensor
Device information :
 * Identifier : the PIN identification number
 * Protocol : DHTSensor
 * Service : gpio

Configure the module to install Temperature and Humidity sub-device types.

### MCP3008 (as SPI)
Device information :
 * Identifier : the SPI identification path (/dev/spidev1.0)
 * Protocol : MCP3008
 * Service : gpio

Create as much sub-device type as connected devices with GPIO pin number as device type identifier.

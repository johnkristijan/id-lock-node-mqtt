# id-lock-node-mqtt
express.js API provider for communication with ID lock 150 (node to mqtt broker)

# installation
npm install

## env variables
store the following variables in a .env file in root dir
```
NODE_PORT=80 // port number
TOPIC=zigbee2mqtt/ID_LOCK_0 // mqtt topic
MQTT_HOST=mqtt://localhost:1883 // mqtt broker server
```

# run server
```
npm run server
```
-- or --
```
node index.js
```

# usage

## set pin
Id lock 150 has 25 user slots, so user has to be 1-25, in this example it is 2. The pin must be a 4 digit PIN code, in this example it is 6777:
```
curl http://localhost/set_pin/user/2/pin/6777
```

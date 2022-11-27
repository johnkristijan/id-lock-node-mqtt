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

Due to the nature of ID LOCK 150 pin confirmation, it is returning 200 OK HTTP response for both successful and non-successful pin changes. Therefore, to confirm that the new PIN has been set, it is recommended to run a `get_pin` GET request for the same user_id after `set_pin` to verify that the pin change was successful.

## get pin
```
curl http://localhost/set_pin/user/2
```


## screen setup example
### start mosquitto mqtt broker
cd
screen -dRR mosquitto
./start_mosquitto.sh
C-a + d to detach screen

### start zigbee2mqtt service
screen -dRR zigbee2mqtt
./start_zigbee2mqtt.sh
C-a + d to detach screen

### start http2mqtt webapp service
screen -dRR webapp
cd id-lock-node-mqtt
sudo node index.js
C-a + d to detach screen

### then server is running and you can
curl 192.168.86.23 # the ip of raspberry
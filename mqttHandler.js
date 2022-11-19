const mqtt = require('mqtt')

const TOPIC = process.env.TOPIC

class MqttHandler {
    constructor() {
        this.mqttClient = null
        this.host = process.env.MQTT_HOST
    }

    connect() {
        this.mqttClient = mqtt.connect(this.host)

        // Mqtt error calback
        this.mqttClient.on('error', (err) => {
            console.log(err)
            this.mqttClient.end()
        })

        // Connection callback
        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`)
        })

        // mqtt subscriptions
        this.mqttClient.subscribe(TOPIC, { qos: 0 })

        // When a message arrives, console.log it
        this.mqttClient.on('message', function (topic, message) {
            console.log(message.toString())
        })

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`)
        })
    }

    // Sends a mqtt message to topic: mytopic
    sendMessage(message) {
        this.mqttClient.publish(`${TOPIC}/set`, message)
    }

    disconnect() {
        console.info('attempting to disconnect the mqtt client')
        this.mqttClient.end()
    }
}

module.exports = MqttHandler

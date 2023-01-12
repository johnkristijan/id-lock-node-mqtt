const mqtt = require('mqtt')

const MESSAGES = [
    {
        battery: 60,
        door_state: 'error_jammed',
        idlock_lock_fw: '1.5.9',
        linkquality: 167,
        lock_mode: 'auto_on_away_off',
        lock_state: 'unlocked',
        master_pin_mode: true,
        relock_enabled: true,
        rfid_enable: true,
        service_mode: 'deactivated',
        sound_volume: 'high_volume',
        state: 'UNLOCK',
        users: {
            1: { pin_code: '100000', status: 'enabled' },
        },
    },
]

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
        this.mqttClient.subscribe(['zigbee2mqtt/ID_LOCK_0', 'zigbee2mqtt/ID_LOCK_1', 'zigbee2mqtt/ID_LOCK_2'], { qos: 0 })

        // When a message arrives, console.log it
        this.mqttClient.on('message', function (topic, message) {
            const msg = message.toString()
            console.log(`>> topic: ${topic} <<`)
            console.log(msg)
            MESSAGES.push(msg)
        })

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`)
        })
    }

    sendMessage(topic, message) {
        this.mqttClient.publish(`${topic}/set`, message)
    }

    infoMessage(topic, message) {
        this.mqttClient.publish(`${topic}/get`, message)
    }

    getLastMessage() {
        return MESSAGES[MESSAGES.length - 1]
    }

    disconnect() {
        this.mqttClient.end()
    }
}

module.exports = MqttHandler

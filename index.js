require('dotenv').config()
require('log-timestamp')
const express = require('express')
const mqttHandler = require('./mqttHandler.js')
const app = express()
const port = process.env.NODE_PORT

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

async function getPinFromJSONbyUser(payload, userId) {
    try {
        const body = await JSON.parse(payload)
        const users = body.users
        const user = users[userId]
        const pin = user.pin_code
        return pin
    } catch (err) {
        return null
    }
}

app.get('/', (req, res) => {
    res.send('Server running.')
})

app.get('/set/:user/:pin', async (req, res) => {
    const USER = req.params.user
    const NEW_PIN = req.params.pin
    console.info(`[pin change request received] set pin to ${NEW_PIN} for user ID ${USER}`)
    const mqtt = new mqttHandler()
    mqtt.connect()
    mqtt.sendMessage(`{"pin_code":{"user":${USER},"pin_code":${NEW_PIN},"expose_pin":true}}`)

    // try to verify pin code every second for the next 30 seconds or else time out
    let body
    let curr_pin
    const ATTEMPTS = 30
    for (let x = 1; x <= ATTEMPTS; x++) {
        await sleep(1000)
        body = mqtt.getLastMessage()
        curr_pin = await getPinFromJSONbyUser(body, USER)
        console.info(`[pin change verification attempt ${x} / ${ATTEMPTS}] lock pin is: ${curr_pin} | should be: ${NEW_PIN}`)

        // after some tests it turns out it takes approx. 10 seconds to verify a PIN change
        if (curr_pin == NEW_PIN) {
            console.info(`[pin change request success] pin set to ${NEW_PIN} for user ID ${USER}`)
            res.send('PIN successfully set to ' + NEW_PIN)
            mqtt.disconnect()
            return
        }
    }
    console.info(`[pin change request failed] pin not set to ${NEW_PIN} for user ID ${USER}`)
    res.status(400).send('PIN not set')
    mqtt.disconnect()
    return
})

app.get(`/battery_status`, async (req, res) => {
    try {
        let mqttClient = new mqttHandler()
        mqttClient.connect()
        const lastMessage = await mqttClient.getLastMessage()
        const jsonified = JSON.parse(lastMessage)
        const battery = jsonified.battery
        res.send(`${battery}%`)
    } catch (err) {
        res.status(400).send('Unable to get battery status')
    }
})

app.listen(port, () => {
    console.log(`node2mqtt app running on port ${port}`)
})

require('dotenv').config()
const express = require('express')
const mqttHandler = require('./mqttHandler.js')
const app = express()
const port = process.env.NODE_PORT

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

app.get('/', (req, res) => {
    res.send('Server running.')
})

app.get(`/set_pin/user/:user_id/pin/:pin_code`, (req, res) => {
    let mqttClient = new mqttHandler()
    mqttClient.connect()
    const userId = req.params.user_id
    const pinCode = req.params.pin_code
    const msg = '{"pin_code":{"user":' + userId + ',"pin_code":' + pinCode + ',"expose_pin":true}}'
    mqttClient.sendMessage(msg)
    res.send(msg)

    // setTimeout(() => {
    //     mqttClient.disconnect()
    // }, 150000)
})

app.get(`/get_pin/user/:user_id`, async (req, res) => {
    try {
        let mqttClient = new mqttHandler()
        mqttClient.connect()
        const userId = req.params.user_id
        const msg = '{"pin_code":{"user":' + userId + '}}'
        mqttClient.infoMessage(msg)
        await sleep(5000)
        const lastMessage = await mqttClient.getLastMessage()
        const jsonified = JSON.parse(lastMessage)
        const users = jsonified.users
        const user = users[userId]
        res.send(user.pin_code)
    } catch (err) {
        res.send('No PIN for this user')
    }
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
        res.send('Unable to get battery status')
    }
})

app.listen(port, () => {
    console.log(`node2mqtt app running on port ${port}`)
})

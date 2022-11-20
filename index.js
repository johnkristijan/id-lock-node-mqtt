require('dotenv').config()
const express = require('express')
const mqttHandler = require('./mqttHandler.js')
const app = express()
const port = process.env.NODE_PORT

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
    let mqttClient = new mqttHandler()
    mqttClient.connect()
    const userId = req.params.user_id
    const msg = '{"pin_code":{"user":' + userId + '}}'
    const feedback = await mqttClient.infoMessage(msg)
    console.log('feedback :>> ', feedback);
    res.send(msg)

    // setTimeout(() => {
    //     mqttClient.disconnect()
    // }, 150000)
})

app.listen(port, () => {
    console.log(`node2mqtt app running on port ${port}`)
})

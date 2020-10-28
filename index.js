const express = require('express')
const fs = require('fs')

const cors = require('cors')
const calcCrow = require('./utils/distance')

const app = express()

app.use(express.json())

app.use(cors())

app.get('/', (req, res) => {
    res.json({
        name: 'Simple apge',
    })
})

app.post('/drivers', (req, res) => {
    if (!req.body.addresses) {
        res.status(400).json({
            code: -1,
            descr: 'Someting went wrong',
        })
    }

    // get drivers data 
    let rawdata = fs.readFileSync('drivers.json');
    let drivers = JSON.parse(rawdata);

    drivers.forEach(element => {
        const distance = calcCrow(req.body.addresses[0].lat, req.body.addresses[0].lng, element.lat, element.lon).toFixed(1)
        element['distance'] = distance
    })

    drivers.sort(function (a, b) {
        return a.distance - b.distance;
    })

    const data = {
        crews_info: drivers
    }

    res.status(201).json({
        code: 0,
        descr: 'OK',
        data: data,
    })
})

app.post('/order', (req, res) => {
    if (!req.body.addresses) {
        res.status(400).json({
            code: -1,
            descr: 'Someting went wrong',
        })
    }

    if (!req.body.crew_id) {
        res.status(400).json({
            code: -1,
            descr: 'Driver has not been selected',
        })
    }

    res.status(201).json({
        code: 0,
        descr: 'OK',
        data: {
            order_id: 12345
        },
    })
})

const port = process.env.PORT || 4400

app.listen(port, () => console.log(`App listening on port ${port}!`))
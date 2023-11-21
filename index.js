const express = require('express');
const superagent = require('superagent');
const app = express();
require('dotenv').config();
app.use(express.json());
const baseUrl = "https://maps.googleapis.com/maps/api/";

app.get('/find-placeid', async (req, res) => {
    try {
        const response = await superagent(`${baseUrl}geocode/json?key=${process.env.GOOGLE_API_KEY}&address=${req.query.outcode}`);
        res.send({ 
            success: true,
            placeId: response.body.results[0].place_id
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            placeId: ""
        })
        console.log(e);
    }
});

app.post('/calculate-distance', async (req, res) => {
    const placeId = req.body.placeId;
    const practices = req.body.destinations;
    try {
        const response = await superagent(`${baseUrl}distancematrix/json?key=${process.env.GOOGLE_API_KEY}&destinations=${practices}&origins=place_id:${placeId}&units=imperial`);
        const x = await response;
        res.send({
            success: true,
            data: x.body.destination_addresses.map((address, i) => {
                const item = x.body.rows[0].elements[i];
                return {
                    address,
                    distance_data: {
                        distance: item.distance,
                        duration: item.duration
                    }
                }
            })
        })
    } catch(e) {
        res.status(500).send({
            success: false,
            data: []
        })
        console.log(e)
    }
});
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
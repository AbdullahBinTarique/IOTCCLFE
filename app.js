const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://<your-backend-ec2-ip>/api/sensordata');
        const data = response.data;

        res.render('index', {
            temperature: data.temperature,
            humidity: data.humidity,
            vibration: data.vibration_detected
        });
    } catch (err) {
        console.error(err);
        res.render('index', { temperature: null, humidity: null, vibration: null });
    }
});

app.listen(PORT, () => {
    console.log(`Frontend server running at http://localhost:${PORT}`);
});

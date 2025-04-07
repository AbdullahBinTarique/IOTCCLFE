const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
// In-memory history (last 10 values)
let history = {
    temperature: [],
    humidity: [],
    vibration: []
};

// API to serve only sensor data history
app.get('/api/chart-data', (req, res) => {
    res.json(history);
});
app.get('/sensorData', async (req, res) => {
    try {
        const response = await axios.get('http://52.91.26.28:3000/api/sensorData');
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
app.get('/inventory', async (req, res) => {
    try {
        const response = await axios.get('http://52.91.26.28:3000/api/inventoryData');
        const data = response.data;
        console.log(response.data)
        res.render('index', {
            prod_id: data.prod_id,
            prod_count: data.prod_count,
        });
    } catch (err) {
        console.error(err);
        res.render('index', { prod_id: null, prod_count: null });
    }
});


async function fetchSensorData() {
    try {
        const response = await axios.get('http://52.91.26.28:3000/api/sensorData');
        const data = response.data;

        // Keep last 10 entries
        ['temperature', 'humidity', 'vibration'].forEach((key) => {
            history[key].push(data[key]);
            if (history[key].length > 10) history[key].shift();
        });
        console.log(response.data)
    } catch (err) {
        console.error('Failed to fetch from backend:', err.message);
    }
}

// Update every 5 seconds
setInterval(fetchSensorData, 5000);
fetchSensorData(); // initial call


app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Frontend server running at http://localhost:${PORT}`);
});

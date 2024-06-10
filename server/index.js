const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors=require('cors');

const app = express();
const PORT = 6000;

app.use(bodyParser.json());
app.use(cors());

const requestMap = new Map();



app.get('/callback', (req, res) => {
    
    console.log(req)
    // requestMap.set(requestId, { accessToken, endpoint });
    res.status(200).send('Callback received');
});
app.post('/callback', (req, res) => {
    const { requestId, accessToken } = req.body;
    console.log(req)
    requestMap.set(requestId, { accessToken });
    res.status(200).send('Callback received');
});

// Endpoint to fetch profile data
app.get('/profile', async (req, res) => {
    console.log("inside")
    const { requestId } = req.query;
    if (requestMap.has(requestId)) {
        const { accessToken } = requestMap.get(requestId);
        try {
            const response = await axios.get(`https://profile4-noneu.truecaller.com/v1/default`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            res.json({ success: true, profile: response.data });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to fetch profile data' });
        }
    } else {
        res.status(404).json({ success: false, error: 'Request ID not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

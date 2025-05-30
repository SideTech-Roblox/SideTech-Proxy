const MongoDB_Client = require('../../../mongodb/initiate');
const Stats = MongoDB_Client.db("SideTech").collection("Stats");

const express = require("express");
const router = express.Router();

const { rateLimit } = require('express-rate-limit');
const RateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 60,
    message: { status: "429", message: "Too many requests, please try again later." },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

router.post('/discord/webhooks/:id/:token', RateLimiter, async (req, res) => {
    try {
        const queryParams = new URLSearchParams(req.query).toString();
        const discordApiUrl = `https://discord.com/api/webhooks/${req.params.id}/${req.params.token}${queryParams ? `?${queryParams}` : ''}`;

        const discordOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: req.body ? JSON.stringify(req.body) : undefined
        };

        const response = await fetch(discordApiUrl, discordOptions);

        let responseData = null;

        if (response.status !== 204 && response.headers.get('content-type')?.includes('application/json')) {
            responseData = await response.json();
        }

        if (response.ok) {
            await Stats.updateOne({ "_id": 'Proxy' }, { $inc: { "requests.discord": 1 } });
            return res.status(response.status).json(responseData || {});
        } else {
            return res.status(response.status).json(responseData || { status: response.status, message: 'Discord API error' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "500", message: "Internal Server Error" });
    }
});

module.exports = router;
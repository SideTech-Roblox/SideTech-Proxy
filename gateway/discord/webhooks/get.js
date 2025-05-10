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

router.get('/discord/webhooks/:id/:token/messages/:messageid', RateLimiter, async (req, res) => {
    try {
        const queryParams = new URLSearchParams(req.query).toString();
        const discordApiUrl = `https://discord.com/api/webhooks/${req.params.id}/${req.params.token}/messages/${req.params.messageid}${queryParams ? `?${queryParams}` : ''}`;

        const discordOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        };

        const response = await fetch(discordApiUrl, discordOptions);

        const responseData = await response.json();

        if (response.ok) {
            await Stats.updateOne({ "_id": 'Proxy' }, { $inc: { "requests.discord": 1 } });
            return res.status(response.status).json(responseData);
        } else {
            return res.status(response.status).json(responseData);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "500", message: "Internal Server Error" });
    }
});

module.exports = router;
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
        const discordOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };

        const response = await fetch(`https://discord.com/api/webhooks/${req.params.id}/${req.params.token}`, discordOptions);

        if (response.ok) {
            await Stats.updateOne({ "_id": 'Proxy' }, { $inc: { "requests.discord": 1 } });
            return res.status(200).json({ status: "200", message: "OK", data: discordOptions });
        } else {
            const errorData = await response.json();
            return res.status(response.status).send(errorData);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "500", message: "Internal Server Error" });
    };
});

module.exports = router;
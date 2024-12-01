const express = require('express');

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.use("/", require("./gateway/discord/webhooks/post"));

app.listen(87922, () => console.log(`✅ | :: System - (Proxy) :: | Service is online!`));
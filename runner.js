const express = require('express');

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.use("/", require("./gateway/discord/webhooks/post"));

app.listen(8792, () => console.log(`✅ | :: System - (Proxy) :: | Service is online!`));
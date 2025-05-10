const express = require('express');

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.use("/", require("./gateway/discord/webhooks/get"));
app.use("/", require("./gateway/discord/webhooks/post"));
app.use("/", require("./gateway/discord/webhooks/patch"));
app.use("/", require("./gateway/discord/webhooks/delete"));

app.listen(8792, () => console.log(`✅ | :: System - (Proxy) :: | Service is online!`));
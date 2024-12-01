const { MongoClient } = require("mongodb");
const { connection_uri } = require("./login.json");

const MongoDB_Client = new MongoClient(connection_uri);

MongoDB_Client.connect().then(async () => {
    console.log("✅ | :: MongoDB - (Proxy) :: | Connection to database established!")
}).catch(() => {
    console.log("🛑 | :: MongoDB - (Proxy) :: | Connection to database failed!")
});

module.exports = MongoDB_Client;
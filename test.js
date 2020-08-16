const Client = require("./client");

var client = new Client();
client.emitter.on("recieved", data => {
    console.log(data);
});
client.request("google.com");
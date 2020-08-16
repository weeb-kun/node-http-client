/*
Copyright 2020 weebkun

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// this is the main client module

const http = require("http");
const event = require("events");

class Client{
    constructor(keepAlive = false, maxSockets = undefined, maxTotalSockets = undefined){
        this.agent = new http.Agent({
            keepAlive,
            maxSockets: maxSockets ? maxSockets : Infinity,
            maxTotalSockets: maxTotalSockets ? maxTotalSockets : Infinity
        });
        this.emitter = new event.EventEmitter();
    }
    
    destroy(){
        this.agent.destroy();
    }

    request(host, port=80, method = "GET", path="/"){
        const req = http.request({
            agent: this.agent,
            method,
            path,
            host,
            port
        });
        req.on("response", res => {
            res.setEncoding("utf-8");
            res.on("data", chunk => {
                this.emitter.emit("recieved", chunk);
            });
        });
        req.end();
    }
}

module.exports = Client;
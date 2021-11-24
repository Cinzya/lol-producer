const axios = require("axios");

class RiotLiveClient {
    constructor() {
        this.url = "https://127.0.0.1:2999";
    }
    async request(endpoint) {
        console.log("[Live] GET - " + endpoint);
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

        try {
            let response = await axios.get(this.url + endpoint);
            return await response.data;
        } catch (error) {
            console.log(error);
        }
        }
    async send(endpoint, data) {
        console.log("[Live] POST - " + data + " to " + endpoint);
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

        try {
            let response = await axios.post(
                this.url + endpoint,
            data
            );
            return await response.data;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = RiotLiveClient;
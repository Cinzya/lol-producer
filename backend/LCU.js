const axios = require("axios");

class RiotLCU {
    constructor(auth) {
        this.username = auth.username;
        this.password = auth.password;
        this.protocol = auth.protocol;
        this.address = auth.address;
        this.port = auth.port;
    }
    token() {
        return Buffer.from(`${this.username}:${this.password}`, "utf8").toString(
        "base64"
        );
    }
    async request(endpoint) {
        console.info("[LCU] GET - " + endpoint);
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
        
        try {
            let response = await axios.get(
            `${this.protocol}://${this.address}:${this.port}${endpoint}`,
            {
                headers: {
                Authorization: `Basic ${this.token()}`,
                },
            }
            );
            return await response.data;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = RiotLCU;
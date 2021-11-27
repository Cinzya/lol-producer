const axios = require("axios");

class LocalServer {
  constructor() {
    this.url = "http://localhost:8080";
  }
  async send(endpoint, data) {
    console.log(`[Local] POST - ${data} to ${endpoint}`);

    try {
      await axios.patch(this.url + endpoint, data);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = LocalServer;

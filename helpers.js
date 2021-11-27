const axios = require("axios");

class cdragon {
  constructor() {
    this.host = "https://cdn.communitydragon.org/latest/champion/";
  }

  async img(championKey, type) {
    switch (type) {
      case "splashart_original":
        return await `${this.host}${championKey}/splash-art`;
        break;
      case "splashart_centered":
        return await `${this.host}${championKey}/splash-art/centered`;
        break;
      case "tile":
        return await `${this.host}${championKey}/tile`;
        break;
      case "portrait":
        return await `${this.host}${championKey}/portrait`;
        break;
      default:
        return;
    }
  }

  async champion(championKey) {
    try {
      const response = await axios.get(`${this.host}${championKey}/data`);
      return await response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = cdragon;

const axios = require("axios");

class cdragon {
  constructor() {
    this.cdn = "https://cdn.communitydragon.org/latest/champion/";
    this.raw = "https://raw.communitydragon.org/";
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

  async spell(id) {
    try {
      var response = await axios.get(
        `${this.raw}/pbe/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json`
      );
      response = await response.data;
      for (const element of response) {
        if (element.id === id) {
          var { name, iconPath } = element;
          iconPath = iconPath.replace(
            "/lol-game-data/assets/DATA/Spells/Icons2D/",
            "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/"
          );
          const result = { name: name, iconPath: iconPath };
          return result;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = cdragon;

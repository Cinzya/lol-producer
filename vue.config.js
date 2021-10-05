module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: false,
      allowRunningInsecureContent: true,
      webSecurity: false
    }
  }
};

module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: false,
      allowRunningInsecureContent: true,
      webSecurity: false,
      preload: "src/preload.js",
    },
  },
  devServer: {
    proxy: "http://localhost:8080",
  },
};

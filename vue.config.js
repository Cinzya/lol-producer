module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: false,
      allowRunningInsecureContent: true,
      webSecurity: false,
      mainProcessFile: 'backend/background.js',
      rendererProcessFile: 'app/src/main.js',
      preload: "app/src/preload.js",
    },
  },
  devServer: {
    proxy: "http://localhost:8080",
  },
};

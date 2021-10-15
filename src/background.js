"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
// const path = require("path");
import LCUConnector from "lcu-connector";
const connector = new LCUConnector();
const axios = require("axios");
const RiotWSProtocol = require("./../js/websocket");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "LoL Producer",
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      // disable CORS
      webSecurity: false,
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true,
      // __static is set by webpack and will point to the public directory
      // preload: path.resolve(__static, "preload.js"),
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  // Disable SSL for specific hosts
  win.webContents.session.setCertificateVerifyProc((request, callback) => {
    const { hostname } = request;
    if (hostname === "127.0.0.1" || "ddragon.canisback.com") {
      callback(0);
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    } else {
      callback(-2);
    }
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

var LCU;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  // Grab LCU credentials
  connector.on("connect", (data) => {
    //  {
    //    address: '127.0.0.1'
    //    port: 18633,
    //    username: 'riot',
    //    password: H9y4kOYVkmjWu_5mVIg1qQ,
    //    protocol: 'https'
    //  }
    console.log("Connect with LCU...");
    LCU = data;
    console.log(LCU);
  });
  // Start listening for the LCU client
  connector.start();

  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// SSL/TSL: this is the self signed certificate support
// app.on(
//   "certificate-error",
//   (event, webContents, url, error, certificate, callback) => {
//     // On certificate error we disable default behaviour (stop loading the page)
//     // and we then say "it is all fine - true" to the callback
//     event.preventDefault();
//     callback(true);
//   }
// );

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// ipc Messages
// const WebSocket = require("ws");

function token() {
  return Buffer.from(`${LCU.username}:${LCU.password}`, "utf8").toString(
    "base64"
  );
}

async function requestLCU(endpoint) {
  console.log("Starting to fetch data");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

  try {
    let response = await axios.get(
      `${LCU.protocol}://${LCU.address}:${LCU.port}${endpoint}`,
      {
        headers: {
          Authorization: `Basic ${token()}`,
        },
      }
    );
    return await response.data;
  } catch (error) {
    console.log(error);
  }
}

async function requestLiveClient(endpoint) {
  console.log("Starting to fetch data");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

  try {
    let response = await axios.get(`https://127.0.0.1:2999${endpoint}`);
    return await response.data;
  } catch (error) {
    console.log(error);
  }
}

async function sendLiveClient(endpoint, data) {
  console.log("Starting to send data");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

  try {
    let response = await axios.post(`https://127.0.0.1:2999${endpoint}`, data);
    return await response.data;
  } catch (error) {
    console.log(error);
  }
}

ipcMain.on("CONNECT_LCU", (event) => {
  if (typeof LCU != "undefined" || LCU != null) {
    (async () => {
      let connection = await requestLCU("/lol-summoner/v1/status/");
      let summoner = await requestLCU("/lol-summoner/v1/current-summoner");
      event.reply("LCU_STATUS", connection);
      event.reply("LCU_SUMMONER", summoner);
    })();
  } else {
    console.log("[error] Connection to LCU could not be established");
    event.reply("LCU_DISCONNECT");
  }
});

ipcMain.on("LCU_DISCONNECT", (event, arg) => {
  connector.on("disconnect", (data) => {
    console.log("LCU disconnected");
    event.reply("LCU_DISCONNECT");
  });
});

ipcMain.on("REPLAY_TIME", (event, arg) => {
  let observing = arg;
  if (observing) {
    setInterval(async () => {
      let timer = await requestLiveClient("/replay/playback");
      event.reply("REPLAY_TIME", timer);
    }, 100);
  }
});

ipcMain.on("ADJUST_TIME", (event, arg) => {
  sendLiveClient("/replay/playback", arg);
});

ipcMain.on("WEBSOCKET", (event, arg) => {
  console.log("Hello from the Websocket");
  const ws = new RiotWSProtocol(
    `wss://${LCU.username}:${LCU.password}@${LCU.address}:${LCU.port}/`
  );
  ws.on("open", () => {
    if (arg == "connect") {
      console.log("Subscribe to WebSockets");
      // Subscribe to all LCU events
      ws.subscribe("OnJsonApiEvent", (rs) => {
        // Get Lobby information
        if (rs.uri == "/lol-lobby/v2/lobby") event.reply("WEBSOCKET", rs);

        // Inform about Client Shutdown
        if (
          rs.uri == "/process-control/v1/process" &&
          rs.data.status == "Stopping"
        ) {
          console.log("Terminate WebSocket");
          event.reply("LCU_DISCONNECT");
          ws.terminate();
        }
      });
    } else if (arg == "disconnect") {
      console.log("Close Websocket");
      ws.close();
    }
  });
});

"use strict";

const { ipcMain } = require("electron");
const LCUConnector = require("lcu-connector");
const connector = new LCUConnector();
const axios = require("axios");
const RiotWSProtocol = require("./../js/websocket");
const net = require("net");
var LCU;

module.exports = () => {
  // Grab LCU credentials
  connector.on("connect", (data) => {
    //  {
    //    address: '127.0.0.1'
    //    port: 18633,
    //    username: 'riot',
    //    password: H9y4kOYVkmjWu_5mVIg1qQ,
    //    protocol: 'https'
    //  }
    console.info("Connect with LCU...");
    LCU = data;
    console.dir(LCU);
  });
  // Start listening for the LCU client
  connector.start();

  var client = new net.Socket();
  client.connect(34243, "127.0.0.1", function () {
    console.log("Connected");
    //   client.write('Hello, server! Love, Client.');
  });

  client.on("data", function (data) {
    console.log("Received: " + data);
    //   client.destroy(); // kill client after server's response
  });

  client.on("close", function () {
    console.log("Connection closed");
  });

  // ipc Messages
  ipcMain.on("LCU", (event, method, type, message) => {
    async function requestLCU(endpoint) {
      console.info("[LCU] GET - " + endpoint);
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

      function token() {
        return Buffer.from(`${LCU.username}:${LCU.password}`, "utf8").toString(
          "base64"
        );
      }

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
        console.error(error);
      }
    }

    if (method == "connect") {
      if (typeof LCU != "undefined" || LCU != null) {
        (async () => {
          let connection = await requestLCU("/lol-summoner/v1/status/");
          let summoner = await requestLCU("/lol-summoner/v1/current-summoner");
          let region = await requestLCU("/lol-login/v1/login-data-packet");
          summoner.region = region.platformId;

          event.reply("LCU_STATUS", connection);
          event.reply("LCU_SUMMONER", summoner);
        })();
      } else {
        console.error("[error] Connection to LCU could not be established");
        event.reply("LCU_DISCONNECT");
      }
    }

    if (method == "WEBSOCKET") {
      const ws = new RiotWSProtocol(
        `wss://${LCU.username}:${LCU.password}@${LCU.address}:${LCU.port}/`
      );
      ws.on("open", () => {
        if (type == "connect") {
          console.info("[LCU] Subscribed to WebSockets");
          // Subscribe to all LCU events
          ws.subscribe("OnJsonApiEvent", (rs) => {
            // Get Lobby information
            if (rs.uri == "/lol-lobby/v2/lobby") event.reply("WEBSOCKET", rs);

            // Inform about Client Shutdown
            if (
              rs.uri == "/process-control/v1/process" &&
              rs.data.status == "Stopping"
            ) {
              console.info("[LCU] Terminate WebSocket");
              event.reply("LCU_DISCONNECT");
              ws.terminate();
            }
          });
        } else if (type == "disconnect") {
          console.info("[LCU] Closed WebSocket");
          ws.close();
        }
      });
    }
  });

  ipcMain.on("LIVE", (event, method, type, message) => {
    async function requestLiveClient(endpoint) {
      console.log("[Live] GET - " + endpoint);
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

      try {
        let response = await axios.get(`https://127.0.0.1:2999${endpoint}`);
        return await response.data;
      } catch (error) {
        console.log(error);
      }
    }

    if (method == "GET") {
      if (type == "REPLAY_TIME") {
        let observing = message;
        if (!observing) {
          var REPLAY_TIME = setInterval(async () => {
            let timer = await requestLiveClient("/replay/playback");
            event.reply("REPLAY_TIME", timer);
          }, 100);
        }
      }
    }

    async function sendLiveClient(endpoint, data) {
      console.log("[Live] POST - " + data + " to " + endpoint);
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

      try {
        let response = await axios.post(
          `https://127.0.0.1:2999${endpoint}`,
          data
        );
        return await response.data;
      } catch (error) {
        console.log(error);
      }
    }

    if (method == "POST") {
      if (type == "ADJUST_TIME") {
        console.log(message);
        sendLiveClient("/replay/playback", message);
      }
    }
    if (method == "STOP") {
      if (type == "REPLAY_TIME") {
        console.log("Hello" + type);
        clearInterval(REPLAY_TIME);
      }
      console.log("[Live] Cleared - " + type);
    }
  });

  ipcMain.on("LCU_DISCONNECT", (event, arg) => {
    connector.on("disconnect", (data) => {
      console.log("LCU disconnected");
      event.reply("LCU_DISCONNECT");
    });
  });
};

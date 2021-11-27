"use strict";

const { ipcMain } = require("electron");
const LCUConnector = require("lcu-connector");
const connector = new LCUConnector();
const RiotWSProtocol = require("./websocket");
const RiotLCU = require("./LCU");
const RiotLiveClient = require("./LiveClient");
const LiveClient = new RiotLiveClient();
const LocalServer = require("./LocalServer");
const Server = new LocalServer();
const net = require("net");
var auth;

module.exports = () => {
  // Grab LCU credentials
  connector.on("connect", (data) => {
    console.info("Connect with LCU...");
    auth = data;
    console.dir(auth);
  });

  // Start listening for the LCU client
  connector.start();

  // Listen to LiveEvent Socket
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
    if (typeof auth != "undefined" || auth != null) {
      var LCU = new RiotLCU(auth);
    }

    if (method == "connect") {
      if (typeof auth != "undefined" || auth != null) {
        (async () => {
          let connection = await LCU.get("/lol-summoner/v1/status/");
          let summoner = await LCU.get("/lol-summoner/v1/current-summoner");
          let region = await LCU.get("/lol-login/v1/login-data-packet");
          summoner.region = region.competitiveRegion;

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
        `wss://${auth.username}:${auth.password}@${auth.address}:${auth.port}/`
      );
      ws.on("open", () => {
        if (type == "connect") {
          console.info("[LCU] Subscribed to WebSockets");

          // Subscribe to all LCU events
          ws.subscribe("OnJsonApiEvent", (rs) => {
            // Get / filter Lobby information
            if (rs.uri == "/lol-lobby/v2/lobby") event.reply("WEBSOCKET", rs);

            // Get / filter Champ Select information
            if (rs.uri == "/lol-champ-select-legacy/v1/session") {
              rs.data.action.forEach((element) => {
                element = element[0];
                if (element.type === "ban") {
                  Server.send(`/champselect/ban/${element.pickTurn}`, {
                    championKey: element.championId
                  });
                }
              });
              rs.data.myTeam.forEach((element) => {
                let summoner = await LCU.get(
                  `/lol-summoner/v1/summoners/${element.summonerId}`
                ).displayName;
                Server.send(`/champselect/player/${element.cellId + 1}`, {
                  player: summoner,
                  spell1: element.spell1Id,
                  spell2: element.spell2Id
                });
              });
              rs.data.theirTeam.forEach((element) => {
                let summoner = await LCU.get(
                  `/lol-summoner/v1/summoners/${element.summonerId}`
                ).displayName;
                Server.send(`/champselect/player/${element.cellId + 1}`, {
                  player: summoner,
                  spell1: element.spell1Id,
                  spell2: element.spell2Id
                });
              });
            }

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
    if (method == "GET") {
      if (type == "REPLAY_TIME") {
        let observing = message;
        if (!observing) {
          var REPLAY_TIME = setInterval(async () => {
            let timer = await LiveClient.request("/replay/playback");
            event.reply("REPLAY_TIME", timer);
          }, 100);
        }
      }
    }

    if (method == "POST") {
      if (type == "ADJUST_TIME") {
        console.log(message);
        LiveClient.send("/replay/playback", message);
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

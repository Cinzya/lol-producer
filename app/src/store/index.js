import Vue from "vue";
import Vuex from "vuex";
const { ipcRenderer } = require("electron");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    summoner: {},
    connection: false,
    observing: false,
  },
  mutations: {
    getSummoner(state, data) {
      state.summoner = data;
    },
    getStatus(state, data) {
      state.connection = data;
    },
    observe(state, data) {
      state.observing = data;
    },
  },
  actions: {
    setSummoner({ commit }) {
      ipcRenderer.on("LCU_SUMMONER", (event, arg) => {
        commit("getSummoner", arg);
      });
    },
    setStatus({ commit }) {
      ipcRenderer.on("LCU_STATUS", (event, arg) => {
        commit("getStatus", arg);
        if (arg.ready) {
          ipcRenderer.send("LCU", "WEBSOCKET", "connect");
        } else ipcRenderer.send("LCU", "WEBSOCKET", "disconnect");
      });
    },
    disconnectLCU({ commit }) {
      commit("getSummoner", {});
      commit("getStatus", false);
    },
  },
  getters: {
    summoner: (state) => {
      if (state.summoner.displayName && state.connection.ready)
        return state.summoner.displayName;
      else return "Offline";
    },
    avatar: (state) => {
      if (state.summoner.profileIconId && state.connection.ready) {
        return `https://ddragon.canisback.com/10.1.1/img/profileicon/${state.summoner.profileIconId}.png`;
      } else {
        return "";
      }
    },
    color: (state) => {
      if (state.connection.ready) return "green";
      else return "red";
    },
  },
  modules: {},
});

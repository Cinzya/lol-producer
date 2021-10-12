import Vue from "vue";
import Vuex from "vuex";
const { ipcRenderer } = require("electron");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    summoner: {},
    connection: false,
  },
  mutations: {
    getSummoner(state, data) {
      state.summoner = data;
    },
    getStatus(state, data) {
      state.connection = data;
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
      });
    },
  },
  getters: {
    summoner: (state) => {
      if (state.summoner.displayName) return state.summoner.displayName;
      else return "Offline";
    },
    avatar: (state) => {
      if (state.summoner.profileIconId) {
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

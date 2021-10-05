import Vue from "vue";
import Vuex from "vuex";
import LCUConnector from 'lcu-connector';
const connector = new LCUConnector();


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    LCU: {}
  },
  mutations: {
    async getLogins(state) {
      await connector.on('connect', (data) => {
        state.LCU = data;
        console.log("Connector");
        //  {
        //    address: '127.0.0.1'
        //    port: 18633,
        //    username: 'riot',
        //    password: H9y4kOYVkmjWu_5mVIg1qQ,
        //    protocol: 'https'
        //  }
    });
    // Start listening for the LCU client
    connector.start();
        }
  },
  actions: {
    async connectLCU({ commit }) {
      await commit('getLogins');
    }
  },
  modules: {},
});

<template>
  <v-app>
    <v-app-bar app :color="color" dark>
      <div class="dv-bind-flex align-center">
        <v-avatar :color="color + ' darken-2'" class="mx-2" size="38">
          <img v-if="connection.ready" :src="avatar" :alt="summoner" />
          <v-icon v-else dark> mdi-account-circle </v-icon>
        </v-avatar>
        <span class="ml-2">{{ summoner }}</span>
      </div>

      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon @click="login()"> mdi-power </v-icon>
      </v-btn>
    </v-app-bar>

    <v-main id="main">
      <router-view />
    </v-main>

    <v-bottom-navigation id="footer">
      <v-btn>
        <span>Recent</span>

        <v-icon>mdi-history</v-icon>
      </v-btn>

      <v-btn>
        <span>Favorites</span>

        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn>
        <span>Nearby</span>

        <v-icon>mdi-map-marker</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import mixin from "./mixin";
import { mapState } from "vuex";
import "./assets/css/styles.scss";
const { ipcRenderer } = require("electron");

export default {
  name: "App",
  mixins: [mixin],
  data: () => ({
    connection: false,
    summonerData: {},
    loading: false,
  }),
  methods: {
    async login() {
      ipcRenderer.send("CONNECT_LCU");
    },
  },
  computed: {
    ...mapState(["LCU"]),
    summoner() {
      if (this.summonerData.displayName && this.connection.ready)
        return this.summonerData.displayName;
      else return "Offline";
    },
    avatar() {
      if (this.summonerData.profileIconId && this.connection.ready) {
        return `https://ddragon.canisback.com/10.1.1/img/profileicon/${this.summonerData.profileIconId}.png`;
      } else {
        return "";
      }
    },
    color() {
      if (this.connection.ready) return "green";
      else return "red";
    },
  },
  created() {
    ipcRenderer.on("LCU_STATUS", (event, arg) => {
      this.connection = arg;
    });
    ipcRenderer.on("LCU_SUMMONER", (event, arg) => {
      this.summonerData = arg;
    });

    ipcRenderer.send("CONNECT_LCU");
  },
};
</script>

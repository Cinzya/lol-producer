<template>
  <v-app>
    <v-app-bar app :color="color" dark>
      <div class="dv-bind-flex align-center">
        <v-avatar :color="color + ' darken-2'" class="mx-2" size="38">
          <img
            v-if="$store.state.connection"
            :src="$store.getters.avatar"
            :alt="$store.getters.summoner"
          />
          <v-icon v-else dark> mdi-account-circle </v-icon>
        </v-avatar>
        <span class="ml-2">{{ $store.getters.summoner }}</span>
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
      <v-btn @click="$router.push('/home')">
        <span>Home</span>

        <v-icon>mdi-history</v-icon>
      </v-btn>

      <v-btn @click="$router.push('/ingame')">
        <span>In-Game</span>

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
import { mapGetters, mapState } from "vuex";
import "./assets/css/styles.scss";
const { ipcRenderer } = require("electron");

export default {
  name: "App",
  mixins: [mixin],
  data: () => ({
    connection: false,
    loading: false,
  }),
  methods: {
    async login() {
      ipcRenderer.send("CONNECT_LCU");
    },
  },
  computed: {
    ...mapGetters(["summoner", "avatar", "color"]),
    ...mapState(["connection"]),
  },
  created() {
    this.$store.dispatch("setStatus");
    this.$store.dispatch("setSummoner");

    ipcRenderer.send("CONNECT_LCU");
  },
};
</script>

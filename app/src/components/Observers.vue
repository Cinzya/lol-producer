<template>
  <v-row>
    <v-col>
      <v-subheader>Observers</v-subheader>
      <v-row justify="start">
        <observer
          :observer="{ ...$store.state.summoner, playback: playback }"
          :avatar="$store.getters.avatar"
          :isobserving="observing"
          :dummytime="false"
          @getTimer="getTimer"
        />
        <!-- <observer
            :observer="{ displayName: 'Observer 2', region: 'EUW' }"
            :avatar="false"
            :isobserving="observing"
            :dummytime="timer"
          /> -->
        <observer
          v-for="observer in observers"
          v-bind:key="observer"
          :observer="observer"
          :avatar="false"
          :dummytime="false"
        />
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import observer from "./Observer/observer.vue";
import { mapGetters, mapState } from "vuex";
const { ipcRenderer } = require("electron");

export default {
  components: { observer },
  name: "Observers",
  data: () => ({
    timer: 600,
    playback: {},
    observers: [false],
    observing: false,
  }),
  methods: {
    getTimer() {
      if (!this.observing) {
        ipcRenderer.on("REPLAY_TIME", (event, arg) => {
          this.playback = arg;
        });
        ipcRenderer.send("LIVE", "GET", "REPLAY_TIME", this.observing);
        this.observing = !this.observing;
      } else {
        ipcRenderer.send("LIVE", "GET", "REPLAY_TIME", this.observing);
        this.playback = {};
        ipcRenderer.removeListener("REPLAY_TIME");
        this.observing = !this.observing;
      }
    },
    stopTimer() {
      this.observing = !this.observing;
      ipcRenderer.send("LIVE", "STOP", "REPLAY_TIME");
    },
    setTimer(t) {
      ipcRenderer.send("LIVE", "POST", "ADJUST_TIME", t);
    },
    getObserver() {},
  },
  computed: {
    ...mapState(["summoner"]),
    ...mapGetters(["avatar"]),
  },
  mounted() {
    setInterval(() => {
      this.timer += 0.1;
      if (this.timer > 900) this.timer = 600;
    }, 100);
    Math.round(this.timer * 10) / 10;
  },
};
</script>

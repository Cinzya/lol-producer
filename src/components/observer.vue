<template>
  <v-col cols="auto">
    <v-card
      v-if="
        $store.state.observing ||
        observer.displayName !== $store.state.summoner.displayName
      "
      elevation="2"
      class="text-center ml-3"
      width="190"
    >
      <v-card-title>
        <v-avatar rounded size="34" class="mr-4">
          <img :src="avatar" v-if="avatar" />
          <img
            src="https://ddragon.canisback.com/10.1.1/img/profileicon/29.png"
            v-else
          />
        </v-avatar>
        {{ observer.displayName }}</v-card-title
      >
      <v-card-text>
        <p class="text-subtitle-1 my-0">{{ time }}</p>
        <v-divider class="my-2"></v-divider>
        <v-row justify="center" class="text--disabled">
          <v-col cols="auto">
            <v-icon
              color="grey darken-1"
              v-if="!playback.paused && !playback.seeking"
              >mdi-play</v-icon
            >
            <v-icon v-else-if="playback.seeking">mdi-refresh</v-icon>
            <v-icon v-else>mdi-pause</v-icon>
          </v-col>

          <v-col cols="auto">
            <span v-if="playback.speed == 8">x8</span>
            <span v-else-if="playback.speed == 4">x4</span>
            <span v-else-if="playback.speed == 2">x2</span>
            <span v-else>x1</span>
          </v-col>

          <v-col cols="auto">
            <span>{{ observer.region }}</span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <!-- TODO: Remove Dummy input -->
        <v-btn
          v-if="observer.displayName !== $store.state.summoner.displayName"
          @click="setTimer({ time: $props.dummytime })"
          text
          :disabled="!$store.state.observing"
          color="primary"
        >
          Sync
        </v-btn>
        <v-btn
          v-if="observer.displayName == $store.state.summoner.displayName"
          text
          @click="stopTimer()"
          color="error"
        >
          Stop
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card
      v-else
      elevation="2"
      class="text-center ml-3"
      width="190"
      color="#385F73"
    >
      <v-btn
        v-if="observer.displayName === this.$store.state.summoner.displayName"
        @click="getTimer()"
        text
        color="primary"
        class="m-0 p-0"
        min-height="203px"
        width="100%"
      >
        <div class="flex-column">
          <v-icon x-large>mdi-power</v-icon>
          <p>Start Observing</p>
        </div>
      </v-btn>
    </v-card>
  </v-col>
</template>
<script>
const { ipcRenderer } = require("electron");
import { mapState, mapActions } from "vuex";

export default {
  name: "observer",
  data: () => ({
    playback: {},
  }),
  props: ["observer", "avatar", "dummytime"],
  methods: {
    getTimer() {
      if (!this.$store.state.observing) {
        ipcRenderer.on("REPLAY_TIME", (event, arg) => {
          this.playback = arg;
        });
        ipcRenderer.send(
          "LIVE",
          "GET",
          "REPLAY_TIME",
          this.$store.state.observing
        );
        this.$store.commit("observe", !this.$store.state.observing);
      } else {
        ipcRenderer.send(
          "LIVE",
          "GET",
          "REPLAY_TIME",
          this.$store.state.observing
        );
        this.playback = {};
        ipcRenderer.removeListener("REPLAY_TIME");
        this.$store.commit("observe", !this.$store.state.observing);
      }
    },
    stopTimer() {
      this.$store.commit("observe", !this.$store.state.observing);
      ipcRenderer.send("LIVE", "STOP", "REPLAY_TIME");
    },
    setTimer(t) {
      ipcRenderer.send("LIVE", "POST", "ADJUST_TIME", t);
    },
  },
  computed: {
    ...mapState(["summoner"]),
    ...mapActions(["observe"]),
    time() {
      if (this.$props.dummytime)
        return Math.round(this.$props.dummytime * 10) / 10;
      else {
        if (this.playback.time) {
          // Math.round(this.playback.time * 10) / 10;
          // let minutes = this.playback.time / 60;
          // minutes = Math.floor(minutes);
          // let seconds = this.playback.time % 60;
          // seconds = Math.round(seconds * 10) / 10;
          // return minutes + ":" + seconds;
          return Math.round(this.playback.time * 10) / 10;
        } else {
          return "0";
        }
      }
    },
  },
};
</script>

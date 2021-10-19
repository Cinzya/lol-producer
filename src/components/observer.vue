<template>
  <v-col cols="auto">
    <v-card v-if="observing" elevation="2" class="text-center ml-3" width="190">
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
        <v-btn
          v-if="observer.displayName !== this.$store.state.summoner.displayName"
          @click="setTimer(playback.time)"
          text
          color="primary"
        >
          Sync
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
        color="deep-purple accent-4"
      >
        <v-icon>mdi-power</v-icon>
      </v-btn>
    </v-card>
  </v-col>
</template>
<script>
const { ipcRenderer } = require("electron");
import { mapState } from "vuex";

export default {
  name: "observer",
  data: () => ({
    playback: {},
  }),
  props: ["observer", "avatar", "dummytime"],
  methods: {
    getTimer() {
      if (!this.observing) {
        console.log("Get time");
        ipcRenderer.on("REPLAY_TIME", (event, arg) => {
          this.playback = arg;
        });
        // ipcRenderer.send("REPLAY_TIME", this.observing);
        ipcRenderer.send("LIVE", "GET", "REPLAY_TIME", this.observing);
      } else {
        // ipcRenderer.send("REPLAY_TIME", this.observing);
        ipcRenderer.send("LIVE", "GET", "REPLAY_TIME", this.observing);
        this.playback = {};
        ipcRenderer.removeListener("REPLAY_TIME");
      }
    },
    setTimer(t) {
      ipcRenderer.send("LIVE", "POST", "ADJUST_TIME", t);
    },
  },
  computed: {
    ...mapState(["summoner"]),
    time() {
      if (this.$props.dummytime) return this.$props.dummytime;
      else {
        if (this.playback.time) {
          // Math.round(this.playback.time * 10) / 10;
          // let minutes = this.playback.time / 60;
          // minutes = Math.floor(minutes);
          // let seconds = this.playback.time % 60;
          // seconds = Math.round(seconds);
          // let miliseconds = (this.playback.time % 60) * 10;
          // miliseconds = Math.round(miliseconds);
          // return minutes + ":" + seconds + ":" + miliseconds;
          return Math.round(this.playback.time * 10) / 10;
        } else {
          return "0";
        }
      }
    },
    observing() {
      if (
        this.playback &&
        Object.keys(this.playback).length === 0 &&
        Object.getPrototypeOf(this.playback) === Object.prototype &&
        this.$props.observer.displayName ==
          this.$store.state.summoner.displayName
      ) {
        return false;
      } else return true;
    },
  },
};
</script>

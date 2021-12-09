<template>
  <v-col cols="auto">
    <v-card
      v-if="
        $props.isobserving ||
        (observer.displayName !== $store.state.summoner.displayName && observer)
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
              v-if="
                !$props.observer.playback.paused &&
                !$props.observer.playback.seeking
              "
              >mdi-play</v-icon
            >
            <v-icon v-else-if="$props.observer.playback.seeking"
              >mdi-refresh</v-icon
            >
            <v-icon v-else>mdi-pause</v-icon>
          </v-col>

          <v-col cols="auto">
            <span>x{{ $props.observer.playback.speed }}</span>
          </v-col>

          <v-col cols="auto">
            <span>{{ $props.observer.region }}</span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <!-- TODO: Remove Dummy input -->
        <v-btn
          v-if="
            $props.observer.displayName !== $store.state.summoner.displayName
          "
          @click="setTimer({ time: $props.dummytime })"
          text
          :disabled="!$props.isobserving"
          color="primary"
        >
          Sync
        </v-btn>
        <v-btn
          v-if="
            $props.observer.displayName == $store.state.summoner.displayName
          "
          text
          @click="startObserving()"
          color="error"
        >
          Stop
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card
      v-else-if="!observer"
      elevation="2"
      class="text-center ml-3"
      width="190"
    >
      <v-card-title>Add Observer</v-card-title>
      <v-card-text>
        <v-text-field v-bind="ip" label="Public IP Address"></v-text-field>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn @click="add()" elevation="2">Add new</v-btn>
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
        @click="startObserving()"
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
import { mapState, mapActions } from "vuex";

export default {
  name: "observer",
  props: ["observer", "avatar", "dummytime", "playback", "isobserving"],
  data: () => ({
    ip: "",
  }),
  methods: {
    startObserving() {
      this.$emit("getTimer");
    },
    stopObserving() {
      this.$emit("stopTimer");
    },
    setTimer() {},
    new() {},
  },
  computed: {
    ...mapState(["summoner"]),
    ...mapActions(["observe"]),
    time() {
      if (this.$props.dummytime)
        return Math.round(this.$props.dummytime * 10) / 10;
      else {
        if (this.$props.observer.playback.time) {
          // Math.round(this.playback.time * 10) / 10;
          // let minutes = this.playback.time / 60;
          // minutes = Math.floor(minutes);
          // let seconds = this.playback.time % 60;
          // seconds = Math.round(seconds * 10) / 10;
          // return minutes + ":" + seconds;
          return Math.round(this.$props.observer.playback.time * 10) / 10;
        } else {
          return "0";
        }
      }
    },
  },
};
</script>

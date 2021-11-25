<template>
  <v-container>
    <v-row>
      <v-col>
        <v-subheader>Observers</v-subheader>
        <v-row justify="start">
          <observer
            :observer="$store.state.summoner"
            :avatar="$store.getters.avatar"
            :dummytime="false"
          />
          <observer
            :observer="{ displayName: 'Observer 2', region: 'EUW1' }"
            :avatar="false"
            :dummytime="timer"
          />
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-subheader>Lobby</v-subheader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import observer from "../components/observer.vue";
import { mapGetters, mapState } from "vuex";

export default {
  components: { observer },
  name: "Ingame",
  data: () => ({
    timer: 600,
  }),
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

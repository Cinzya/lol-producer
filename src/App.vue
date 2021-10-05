<template>
  <v-app>
    <v-app-bar app v-bind:color="connection.ready ? 'green' : 'red'" dark>
      <div class="d-flex align-center">

      <v-avatar color="grey" class="mx-2" size="36">
        <img v-if="connection.ready" :src="avatar" :alt="summoner">

        <v-icon v-else dark>
          mdi-account-circle
        </v-icon>
      </v-avatar>
      <span class="mr-2">{{ summoner }}</span>

      </div>

      <v-spacer></v-spacer>

      <v-btn
        icon
      >
      <v-icon @click="login()">
        mdi-power
      </v-icon>
    </v-btn>

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

  </v-app>
</template>

<script>
import mixin from './mixin';
import { mapState } from 'vuex';

export default {
  name: "App",
  mixins: [mixin],
  data: () => ({
    connection: {},
    summonerData: {}
  }),
  methods: {
    async login() {
      await this.$store.dispatch('connectLCU');
      this.connection = await this.requestLCU('/lol-summoner/v1/status/');
      this.summonerData = await this.requestLCU("/lol-summoner/v1/current-summoner");
    }
  },
  computed: {
    ...mapState(['LCU']),
    summoner() {
      if (this.summonerData.displayName) {
        return this.summonerData.displayName;
      } else {
        return "Offline";
      }
    },
    avatar() {
      if (this.summonerData.profileIconId) {
        return `https://ddragon.canisback.com/10.1.1/img/profileicon/${this.summonerData.profileIconId}.png`;
      } else {
        return "";
      }
    }
  }
};
</script>

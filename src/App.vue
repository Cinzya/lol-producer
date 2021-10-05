<template>
  <v-app>
    <v-app-bar app :color="connection ? 'green' : 'red'" dark>
      <div class="d-flex align-center">

      <v-avatar color="grey" class="mx-2" size="36">
        <v-icon dark>
          mdi-account-circle
        </v-icon>
      </v-avatar>
      <span class="mr-2">Offline</span>

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
    connection: false
  }),
  methods: {
    async login() {
      await this.$store.dispatch('connectLCU');
      await console.log(this.$store.state.LCU);
      this.data.connection = await this.requestLCU('/lol-summoner/v1/status/');
    }
  },
  computed: {
    ...mapState(['LCU'])
  }
};
</script>

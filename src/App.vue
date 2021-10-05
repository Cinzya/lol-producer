<template>
  <v-app>
    <v-app-bar app color="red" dark>
      <div class="d-flex align-center">

      <v-avatar color="red" class="mx-2" size="36">
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
export default {
  name: "App",

  data: () => ({
    connection: false
  }),

  methods: {
    async login() {
      await this.$store.dispatch('connectLCU');
      await console.log(this.$store.state.LCU);
    }
  },
  computed: {
    LCU() {
      return this.$store.state.LCU;
    }
  }
};
</script>

<template>
  <div
    class="my-2 d-flex align-center justify-center flex-column text-center"
    style="height: 100%"
  >
    <v-btn @click="login()" color="error" fab x-large dark>
      <v-icon>mdi-power</v-icon>
    </v-btn>
    <div class="mt-3">Connect to League of Legends</div>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
export default {
  name: "Connect",
  methods: {
    async login() {
      ipcRenderer.send("LCU", "connect");
    },
  },
};
</script>

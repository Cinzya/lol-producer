<template>
  <v-container>
    <observers />
    <v-row>
      <v-col>
        <v-subheader>Lobby</v-subheader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Observers from "../components/Observers.vue";

export default {
  components: { Observers },
  name: "Home",
  data: () => ({}),
  methods: {},
  computed: {},
  mounted() {},
};
</script>

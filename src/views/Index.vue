<template>
  <div class="fill-height">
    <GuestNavbar v-if="!authenticated" />
    <LoggedNavbar v-else />
    <v-main class="grey lighten-3 fill-height">
      <h1>hola</h1>
      <router-view />
    </v-main>
  </div>
</template>

<script>
import LoggedNavbar from "../components/navbar/LoggedNavbar";
import { mapGetters } from "vuex";
import GuestNavbar from "../components/navbar/GuestNavbar";

export default {
  components: { GuestNavbar, LoggedNavbar },
  data: () => ({}),

  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
    }),
  },
};
</script>

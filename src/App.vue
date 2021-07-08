<template>
  <v-app>
    <guest-navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import GuestNavbar from "./components/navbar/GuestNavbar.vue";

export default {
  components: { GuestNavbar },
  name: "App",

  data: () => ({
    //
  }),
};
</script>

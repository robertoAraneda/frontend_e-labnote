<template>
  <v-main class="grey lighten-3">
    <GuestNavbar v-if="!authenticated" />
    <LoggedNavbar v-else />
    <v-breadcrumbs
      large
      v-if="$route.path !== '/'"
      :items="breadcrumbs"
    ></v-breadcrumbs>
    <v-container>
      <router-view />
    </v-container>
  </v-main>
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

    breadcrumbs() {
      const { path } = this.$route;

      const links = path.split("/");

      let href = "";
      return links.map((link, index) => {
        if (index !== 0) {
          href += "/" + link;
          return {
            text: link.toUpperCase().replaceAll("-", " "),
            disabled: index === links.length - 1,
            href: href,
          };
        } else {
          return {
            text: "E-Labnote",
            disabled: false,
            href: "/",
          };
        }
      });
    },
  },
};
</script>

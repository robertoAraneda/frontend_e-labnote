<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    color="primary"
    dark
    width="260"
    mobile-breakpoint="960"
    v-bind="$attrs"
  >
    <v-divider></v-divider>

    <v-list dense nav shaped>
      <v-list-item
        v-for="link in links"
        :key="link.id"
        :to="{ name: link.url }"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ link.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "NavigationDrawer",
  props: {
    links: Array,
  },
  data: () => ({}),
  computed: {
    ...mapState(["drawer"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
  },
};
</script>

<style scoped></style>

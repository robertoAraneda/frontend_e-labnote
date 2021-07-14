<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    width="260"
    mobile-breakpoint="960"
    v-bind="$attrs"
    color="white"
  >
    <v-divider></v-divider>

    <v-list dense rounded>
      <v-subheader>CONFIGURACIÓN AVANZADA</v-subheader>
      <v-list-item-group color="primary darken-1">
        <v-list-item
          v-for="link in links"
          :key="link.id"
          :to="{ name: link.url }"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ link.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
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

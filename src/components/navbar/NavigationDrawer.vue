<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    width="300"
    mobile-breakpoint="960"
    v-bind="$attrs"
    clipped
  >
    <v-sheet color="grey lighten-4" class="pa-4">
      <v-avatar class="mb-4" color="grey darken-1" size="64"></v-avatar>

      <div>administrador@elabnote.com</div>
    </v-sheet>
    <v-divider></v-divider>

    <v-list dense shaped>
      <v-subheader>CONFIGURACIÓN AVANZADA</v-subheader>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="link in links"
          :key="link.id"
          :to="{ name: link.url }"
          active-class="active"
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

<style scoped>
.active {
  background-color: #3999bf;
  color: white;
}
</style>

<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    width="300"
    mobile-breakpoint="960"
    v-bind="$attrs"
    clipped
  >
    <v-sheet color="white" class="pa-4 text-center">
      <v-avatar ou class="mb-4 white--text text-h4" color="primary" size="64">{{
        role
      }}</v-avatar>

      <div class="title">{{ roleDescription }}</div>
    </v-sheet>
    <v-divider></v-divider>

    <v-list dense shaped>
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
import { mapGetters, mapState } from "vuex";

export default {
  name: "NavigationDrawer",
  props: {
    links: Array,
  },
  data: () => ({}),
  computed: {
    ...mapState(["drawer"]),
    ...mapGetters({
      user: "auth/user",
    }),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
    role() {
      if (!this.user) return "";
      return this.user.roles[0].name.charAt(0).toUpperCase();
    },

    roleDescription() {
      if (!this.user) return "";
      return this.user.roles[0].name;
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

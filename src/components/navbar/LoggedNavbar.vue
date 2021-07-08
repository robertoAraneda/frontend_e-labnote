<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="setDrawer()"></v-app-bar-nav-icon>

    <v-toolbar-title>Logged in application</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
  },
  methods: {
    setDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style lang="scss" scoped></style>

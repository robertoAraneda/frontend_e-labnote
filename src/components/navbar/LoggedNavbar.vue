<template>
  <v-app-bar clipped-left app dark color="primary">
    <v-app-bar-nav-icon
      v-if="!isShowAppBarIcon"
      @click="setDrawer()"
    ></v-app-bar-nav-icon>

    <v-toolbar-title>e-LabNote</v-toolbar-title>
    <v-spacer />
    <BaseAcceptButton
      v-if="showMainPageButton"
      label="Página Principal"
      @click="mainPage"
      dark
      color="secondary"
    />
    <BaseAcceptButton
      v-if="showModuleButton"
      label="Modulos"
      @click="redirectModules"
      text
      color="white"
    />
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

    showMainPageButton() {
      return this.$route.name !== "Index";
    },

    showModuleButton() {
      return this.$route.name !== "Modules";
    },
    isShowAppBarIcon() {
      return (
        this.$route.name === "Modules" ||
        this.$route.name === "Login" ||
        this.$route.name === "Index"
      );
    },
  },
  methods: {
    setDrawer() {
      this.drawer = !this.drawer;
    },

    redirectModules() {
      if (this.$route.name !== "Modules") {
        this.$router.push({ name: "Modules" });
      }
    },
    mainPage() {
      if (this.$route.name !== "Index") {
        this.$router.push({ name: "Index" });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>

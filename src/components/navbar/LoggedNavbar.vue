<template>
  <v-app-bar clipped-left app color="primary">
    <v-app-bar-nav-icon
      class="white--text"
      v-if="!isShowAppBarIcon"
      @click="setDrawer()"
    ></v-app-bar-nav-icon>

    <v-toolbar-title class="white--text">e-LabNote</v-toolbar-title>
    <v-spacer />
    <v-container class="py-0 fill-height">
      <BaseAcceptButton
        v-if="showMainPageButton"
        label="Página Principal"
        @click="mainPage"
        text
        class="white--text ml-3"
      />
      <BaseAcceptButton
        v-if="showModuleButton"
        label="Modulos"
        @click="redirectModules"
        text
        class="white--text ml-3"
      />
    </v-container>
    <v-avatar class="mr-10" color="grey darken-1" size="32">A</v-avatar>
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

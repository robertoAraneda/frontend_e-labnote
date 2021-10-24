<template>
  <v-app-bar clipped-left app color="primary">
    <v-toolbar-title
      style="width: 270px"
      class="text-h4 white--text text-center font-weight-bold"
      >e-LabNote</v-toolbar-title
    >
    <v-app-bar-nav-icon
      class="white--text"
      v-if="!isShowAppBarIcon"
      @click="setDrawer()"
    ></v-app-bar-nav-icon>

    <v-spacer />
    <v-toolbar-items>
      <BaseAcceptButton
        v-if="showMainPageButton"
        label="Página Principal"
        @click="mainPage"
        class="white--text ml-3"
        color="primary"
    /></v-toolbar-items>
    <v-toolbar-items>
      <BaseAcceptButton
        v-if="showObservationPageButton"
        label="Prestaciones"
        @click="observations"
        class="white--text ml-3"
        color="primary"
    /></v-toolbar-items>
    <v-toolbar-items>
      <BaseAcceptButton
        v-if="showModuleButton"
        label="Modulos"
        @click="redirectModules"
        class="white--text ml-3 mr-12"
        color="primary"
    /></v-toolbar-items>
    <v-avatar size="32" class="ml-12 mr-2" color="white">
      <v-icon color="primary">mdi-account</v-icon>
    </v-avatar>
    <v-toolbar-title class="white--text body-1">
      {{ loggedUserInfo }}</v-toolbar-title
    >
    <v-btn class="ml-n3" icon>
      <v-icon color="white">mdi-chevron-down</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  mounted() {
    console.log("user", this.user);
    console.log(this.$route);
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),

    loggedUserInfo() {
      if (!this.user) return "";
      return `${this.user.names} ${this.user.lastname} ${this.user.mother_lastname}`;
    },

    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },

    showMainPageButton() {
      return this.$route.name !== "Landing";
    },

    showObservationPageButton() {
      return this.$route.name !== "Observations";
    },

    showModuleButton() {
      return this.$route.name !== "Modules";
    },
    isShowAppBarIcon() {
      return (
        this.$route.name === "Modules" ||
        this.$route.name === "Login" ||
        this.$route.name === "Landing"
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
      if (this.$route.name !== "Landing") {
        this.$router.push({ name: "Landing" });
      }
    },
    observations() {
      if (this.$route.name !== "Observations") {
        this.$router.push({ name: "Observations" });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>

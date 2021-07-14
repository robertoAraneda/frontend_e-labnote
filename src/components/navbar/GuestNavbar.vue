<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Guest</v-toolbar-title>
    <v-spacer />
    <BaseAcceptButton
      v-if="showMainPageButton"
      label="Página Principal"
      @click="mainPage"
      text
      color="white"
    />
    <BaseAcceptButton
      color="white"
      text
      v-if="showLogin"
      label="Login"
      @click="login"
    />
  </v-app-bar>
</template>

<script>
export default {
  name: "GuestNavbar",

  data: () => ({}),

  computed: {
    showLogin() {
      return this.$route.name !== "Login";
    },
    showMainPageButton() {
      return this.$route.name !== "Index";
    },
  },

  methods: {
    login() {
      if (this.$route.name !== "Login") {
        this.$router.push({ name: "Login" });
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

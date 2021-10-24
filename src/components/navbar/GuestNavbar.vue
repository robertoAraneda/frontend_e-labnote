<template>
  <v-app-bar
    v-scroll="onScroll"
    :color="!isScrolling ? 'transparent' : 'primary'"
    fixed
    flat
    dark
  >
    <v-slide-x-transition>
      <v-container v-if="showLogo">
        <v-row>
          <v-toolbar-title
            @click="$vuetify.goTo('#hero')"
            style="width: 270px; cursor: pointer"
            class="text-h4 white--text text-center font-weight-bold"
            >e-Labnote</v-toolbar-title
          >
          <v-btn
            v-if="!hideOptionsAppBar"
            large
            text
            @click="$vuetify.goTo('#about-me')"
            >ACERCA DE LABISUR</v-btn
          >
          <v-btn
            v-if="!hideOptionsAppBar"
            text
            @click="$vuetify.goTo('#features')"
            large
            >PRESTACIONES</v-btn
          >

          <v-btn
            v-if="!hideOptionsAppBar"
            text
            @click="$vuetify.goTo('#blog')"
            large
            >NUESTROS FUNCIONARIOS</v-btn
          >
          <v-btn
            v-if="!hideOptionsAppBar"
            text
            @click="$vuetify.goTo('#contact')"
            large
            >CONTACTO</v-btn
          >
        </v-row>
      </v-container>
    </v-slide-x-transition>
    <v-spacer />

    <v-btn
      @click="observations"
      v-if="showObservationsButton"
      text
      rounded
      large
      :color="isScrolling ? '' : 'secondary darken-3'"
      >cartera de prestaciones</v-btn
    >

    <v-btn
      @click="mainPage"
      v-if="showMainPageButton"
      text
      rounded
      large
      :color="isScrolling ? '' : 'secondary darken-3'"
      >Página Principal</v-btn
    >
    <v-btn
      text
      @click="login"
      v-if="showLogin"
      rounded
      large
      :color="isScrolling ? '' : 'secondary darken-3'"
      >INICIAR SESIÓN</v-btn
    >
  </v-app-bar>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "GuestNavbar",

  data: () => ({
    showLogo: false,
    isScrolling: false,
  }),

  computed: {
    showLogin() {
      return this.$route.name !== "Login";
    },
    showMainPageButton() {
      return this.$route.name !== "Landing";
    },
    showObservationsButton() {
      return (
        this.$route.name !== "Observations" &&
        this.$route.name !== "Landing" &&
        !this.$route.path.startsWith("/catalogo-prestaciones")
      );
    },
    hideOptionsAppBar() {
      return this.$route.path.startsWith("/catalogo-prestaciones");
    },
  },

  methods: {
    ...mapActions({
      setIsScrolling: "setIsScrolling",
    }),

    onScroll() {
      const offset = window.pageYOffset;
      this.isScrolling = offset > 50;
      this.showLogo = offset > 200;

      this.setIsScrolling(this.isScrolling);
    },

    login() {
      if (this.$route.name !== "Login") {
        this.$router.push({ name: "Login" });
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

<template>
  <v-main>
    <section id="main-header" class="white lighten-1 fill-height">
      <div class="py-12"></div>

      <v-container class="text-center">
        <h2 class="display-2 font-weight-bold mb-3">SIEL</h2>
        <h2 class="display-1 font-weight-light mb-3">
          Sistema de información de exámenes de laboratorio
        </h2>

        <v-responsive class="mx-auto mb-12" width="56">
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>
      </v-container>
      <router-view />

      <div class="py-12"></div>
    </section>
    <v-footer class="justify-center" color="secondary darken-2" height="100">
      <div
        class="title font-weight-light grey--text text--lighten-1 text-center"
      >
        &copy; {{ new Date().getFullYear() }} -
        <span class="font-weight-bold text-h5">e-Labnote</span>
      </div>
    </v-footer>
  </v-main>
  <!--
    <v-parallax dark height="250" :src="parallaxImg">
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="display-3 font-weight-light mb-4">SIEL</h1>
          <h4 class="headline">
            Sistema de información de exámenes de laboratorio
          </h4>
        </v-col>
      </v-row>
    </v-parallax>

    -->
</template>

<script>
import parallaxImg from "../../assets/vbanner.jpg";
import atbImg from "../../assets/imgatb.jpg";
import { mapGetters } from "vuex";

let alphabet = "abcdefghijklmnopqrstuvwxyz";

const abc = [];

for (let i = 0; i < alphabet.length; i++) {
  abc.push(alphabet.charAt(i));
}

export default {
  name: "Observation",

  data: () => ({
    parallaxImg,
    atbImg,
    abc,
    toggle_none: null,
  }),

  computed: {
    ...mapGetters({
      isScrolling: "isScrolling",
    }),
  },

  methods: {
    findObservation() {
      console.log("vbuscando");
    },
    handleFindObservationsbyLetter(letter) {
      this.$router.push({ name: "ObservationByLetter", params: { letter } });
    },
  },
};
</script>

<style scoped></style>

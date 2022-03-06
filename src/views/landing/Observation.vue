<template>
  <v-container class="text-center">
    <v-row class="justify-center">
      <v-col cols="12" md="4">
        <v-img :src="atbImg" class="mb-4" height="275" max-width="100%"></v-img>

        <h3
          class="font-weight-black mb-4 text-uppercase"
          v-html="titleAnalyte"
        ></h3>

        <div
          style="text-align: justify; text-justify: inter-word"
          class="title font-weight-light mb-5"
          v-html="textAnalyte"
        ></div>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="py-12 px-4" color="grey lighten-5" flat>
          <v-theme-provider dark>
            <div>
              <v-avatar color="primary" size="88">
                <v-icon large v-text="'mdi-handshake'"></v-icon>
              </v-avatar>
            </div>
          </v-theme-provider>

          <v-card-title class="justify-center font-weight-black text-uppercase"
            >Catalogo de exámenes</v-card-title
          >

          <v-card-text class="subtitle-1">
            <v-text-field
              append-icon="mdi-magnify"
              solo
              label="Buscar"
              @click:append="findObservation"
            ></v-text-field>

            <v-btn
              class="my-1"
              height="50"
              v-for="letter in abc"
              :key="letter"
              @click="handleFindObservationsbyLetter(letter)"
            >
              <v-icon size="32" color="primary">{{
                `mdi-alpha-${letter}`
              }}</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import parallaxImg from "../../assets/vbanner.jpg";
import atbImg from "../../assets/imgatb.jpg";

let alphabet = "abcdefghijklmnopqrstuvwxyz";

const abc = [];

for (let i = 0; i < alphabet.length; i++) {
  abc.push(alphabet.charAt(i));
}

export default {
  name: "Observation",

  data: () => ({
    titleAnalyte: "",
    textAnalyte: "",
    parallaxImg,
    atbImg,
    abc,
    toggle_none: null,
  }),

  mounted() {
    const domain = window.location.host;
    if (domain === "labisur.elabnote.cl") {
      this.titleAnalyte = "EXÁMENES LABISUR";
      this.textAnalyte = `El Laboratorio Clínico LABISUR ofrece una completa variedad de exámenes.
Desde los más habituales de cualquier laboratorio clínico hasta aquellos más especializados que aportarán una efectividad importante al diagnóstico.`;
    } else if (domain === "labhhha.elabnote.cl") {
      this.titleAnalyte = "EXÁMENES LABORATORIO HHHA";
      this.textAnalyte = `El Laboratorio Clínico HHHA ofrece una completa variedad de exámenes.
Desde los más habituales de cualquier laboratorio clínico hasta aquellos más especializados que aportarán una efectividad importante al diagnóstico.`;
    } else {
      this.titleAnalyte = "EXÁMENES LABISUR";
      this.textAnalyte = `El Laboratorio Clínico LABISUR ofrece una completa variedad de exámenes.
Desde los más habituales de cualquier laboratorio clínico hasta aquellos más especializados que aportarán una efectividad importante al diagnóstico.`;
    }
  },

  methods: {
    findObservation() {
      console.log(this.$route);
      console.log("vbuscando");
    },
    handleFindObservationsbyLetter(letter) {
      this.$router.push({
        name: "ObservationByLetter",
        params: { letter: letter.toUpperCase() },
      });
    },
  },
};
</script>

<style scoped></style>

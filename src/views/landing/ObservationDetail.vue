<template>
  <v-main>
    <section class="grey lighten-5">
      <div class="py-3"></div>
      <v-container class="align-start">
        <h2 class="display-1 font-weight-bold mb-3">{{ name }}</h2>
        <div class="d-flex align-start">
          <h2 class="headline font-weight-bold mb-3 mr-3 primary--text">
            LOINC:
          </h2>
          <h2 class="headline font-weight-bold mb-3 mr-3">
            {{ loinc.loinc_num }}
          </h2>
          <h2 class="headline font-weight-bold mb-3">{{ loinc.name }}</h2>
          <v-btn
            class="mt-n2"
            :href="`https://loinc.org/${loinc.loinc_num}/`"
            target="_blank"
            depressed
            icon
          >
            <v-icon color="orange darken-4"> mdi-open-in-new </v-icon>
          </v-btn>
        </div>

        <v-row>
          <v-col cols="12" md="4"> </v-col>
        </v-row>
      </v-container>
      <div class="py-3"></div>
    </section>

    <section>
      <div class="py-3"></div>
      <v-container class="align-start">
        <h2 class="headline font-weight-bold mb-3 mr-3 primary--text">
          INFORMACIÓN GENERAL
        </h2>
        <v-card flat>
          <v-card-title class="headlinefont-weight-medium text-uppercase">
            Utilidad clínica
          </v-card-title>
          <v-card-text
            style="text-align: justify; text-justify: inter-word"
            v-text="clinicalInformation"
            class="subtitle-1"
          >
          </v-card-text>
          <v-card-title class="headlinefont-weight-medium text-uppercase">
            Recepción, procesamiento y tiempo de respuesta
          </v-card-title>
          <v-row>
            <v-col cols="12" md="4" class="text-center">
              <v-card class="py-12 px-4" color="grey lighten-5" flat>
                <v-theme-provider dark>
                  <div>
                    <v-avatar color="primary" size="88">
                      <v-icon large>mdi-check</v-icon>
                    </v-avatar>
                  </div>
                </v-theme-provider>

                <v-card-title
                  class="justify-center font-weight-black text-uppercase"
                  >Recepción</v-card-title
                >

                <v-card-text class="subtitle-1"
                  >Las muestras se recepcionan en dependencias de nuestro
                  laboratorio
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4" class="text-center">
              <v-card class="py-12 px-4" color="grey lighten-5" flat>
                <v-theme-provider dark>
                  <div>
                    <v-avatar color="primary" size="88">
                      <v-icon large>mdi-biohazard</v-icon>
                    </v-avatar>
                  </div>
                </v-theme-provider>

                <v-card-title
                  class="justify-center font-weight-black text-uppercase"
                  >Procesamiento</v-card-title
                >

                <v-card-text class="subtitle-1"
                  >Procesamiento analítico en horario<br />
                  <v-chip dark color="orange darken-4" class="mt-3"
                    ><span class="font-weight-bold">{{
                      processTime
                    }}</span></v-chip
                  >
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4" class="text-center">
              <v-card class="py-12 px-4" color="grey lighten-5" flat>
                <v-theme-provider dark>
                  <div>
                    <v-avatar color="primary" size="88">
                      <v-icon large> mdi-clock</v-icon>
                    </v-avatar>
                  </div>
                </v-theme-provider>

                <v-card-title
                  class="justify-center font-weight-black text-uppercase"
                  >Tiempo de respuesta</v-card-title
                >

                <v-card-text class="subtitle-1"
                  >El tiempo de respuesta es de <br />
                  <v-chip dark color="orange darken-4" class="mt-3"
                    ><span class="font-weight-bold">1 DÍA HÁBIL</span></v-chip
                  >
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
      <div class="py-3"></div>
    </section>
    <section></section>
    <section class="text-center">
      <h4>¿Te resultó útil esta información?</h4>
      <div class="mt-6">
        <v-rating
          v-model="rating"
          color="yellow darken-3"
          background-color="grey darken-1"
          empty-icon="$ratingFull"
          half-increments
          hover
        ></v-rating>
      </div>
    </section>

    <v-fab-transition>
      <v-btn
        v-if="isScrolling"
        color="primary"
        fab
        large
        dark
        bottom
        right
        fixed
        @click="$vuetify.goTo('#main-header')"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ObservationDetail",

  data: () => ({
    selectedObservationServiceRequest: null,
    rating: 5,
  }),

  async mounted() {
    const { data } = await this.getItemBySlugPublicAuth(
      this.$route.params.slug
    );
    this.selectedObservationServiceRequest = data;
  },

  computed: {
    ...mapGetters({
      isScrolling: "isScrolling",
    }),

    name() {
      if (!this.selectedObservationServiceRequest) return "";
      return this.selectedObservationServiceRequest.name;
    },

    loinc() {
      if (!this.selectedObservationServiceRequest) return "";
      return this.selectedObservationServiceRequest._embedded.loinc;
    },
    clinicalInformation() {
      if (!this.selectedObservationServiceRequest) return "";
      return this.selectedObservationServiceRequest.clinical_information;
    },

    processTime() {
      if (!this.selectedObservationServiceRequest) return "";
      return this.selectedObservationServiceRequest._embedded.processTime.name;
    },
  },

  methods: {
    ...mapActions({
      getItemBySlugPublicAuth:
        "observationServiceRequest/getItemBySlugPublicAuth",
    }),
  },
};
</script>

<style scoped></style>

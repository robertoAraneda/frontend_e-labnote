<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" sm="5" class="text-center">
        <v-card class="py-12 px-4" color="grey lighten-5" flat>
          <v-theme-provider dark>
            <div>
              <v-avatar color="primary" size="88">
                <v-icon large v-text="'mdi-handshake'"></v-icon>
              </v-avatar>
            </div>
          </v-theme-provider>

          <v-card-title class="justify-center font-weight-black text-uppercase"
            >Catálogo de exámenes</v-card-title
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
              :class="
                letter.toUpperCase() === $route.params.letter
                  ? 'grey lighten-1'
                  : ''
              "
            >
              <v-icon size="32" color="primary">{{
                `mdi-alpha-${letter}`
              }}</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="py-6 px-4" color="grey lighten-5" flat>
          <v-card-title class="justify-center font-weight-medium text-uppercase"
            >Catálogo de exámenes que comienzan con la letra
          </v-card-title>
          <v-theme-provider dark>
            <div class="text-center">
              <v-avatar color="primary" size="48">
                <v-icon
                  large
                  v-text="`mdi-alpha-${letter.toLowerCase()}`"
                ></v-icon>
              </v-avatar>
            </div>
          </v-theme-provider>

          <v-card-text class="subtitle-1">
            <v-list two-line>
              <v-list-item-group
                @change="handleFindObservationServiceRequestBySlug"
                v-model="selected"
                active-class="primary--text"
              >
                <template
                  v-for="(item, index) in foundedServiceRequestObservations"
                >
                  <v-list-item :key="item.id">
                    <template v-slot:default="{ active }">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.name"
                        ></v-list-item-title>

                        <v-list-item-subtitle class="text--primary"
                          >LOINC: {{ item.loinc_num }}</v-list-item-subtitle
                        >
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-list-item-action-text>test</v-list-item-action-text>

                        <v-icon v-if="!active" color="grey lighten-1">
                          mdi-star-outline
                        </v-icon>

                        <v-icon v-else color="yellow darken-3">
                          mdi-star
                        </v-icon>
                      </v-list-item-action>
                    </template>
                  </v-list-item>

                  <v-divider
                    v-if="index < foundedServiceRequestObservations.length - 1"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card-text> </v-card
      ></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

let alphabet = "abcdefghijklmnopqrstuvwxyz";

const abc = [];

for (let i = 0; i < alphabet.length; i++) {
  abc.push(alphabet.charAt(i));
}

export default {
  name: "ObservationByLetter",

  data: () => ({
    abc,
    toggle_none: null,
    letter: "",
    foundedServiceRequestObservations: [],
    selected: undefined,
  }),

  async mounted() {
    this.letter = this.$route.params.letter;

    await this.handleFindObservationsbyLetter(this.letter);

    console.log(this.$route);
  },

  methods: {
    ...mapActions({
      getObservationsByLetter:
        "observationServiceRequest/getPaginatedItemsByLetter",
    }),
    findObservation() {
      console.log("vbuscando");
    },
    async handleFindObservationsbyLetter(letter) {
      this.letter = letter.toUpperCase();

      const { data } = await this.getObservationsByLetter({
        letter: this.letter,
      });

      this.foundedServiceRequestObservations = data.collection;

      if (this.$route.params.letter !== this.letter) {
        this.$router.replace({
          name: "ObservationByLetter",
          params: { letter: this.letter },
        });
      }
    },

    handleFindObservationServiceRequestBySlug() {
      const slug = this.foundedServiceRequestObservations[this.selected].slug;
      this.$router.push({ name: "ObservationDetail", params: { slug } });
    },
  },
};
</script>

<style scoped></style>

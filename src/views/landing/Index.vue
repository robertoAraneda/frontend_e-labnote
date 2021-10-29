<template>
  <div>
    <v-main>
      <section id="hero">
        <v-row no-gutters>
          <v-card
            flat
            :min-height="'calc(100vh - ' + $vuetify.application.top + 'px)'"
            width="100%"
          >
            <v-theme-provider dark>
              <v-container fluid fill-height>
                <v-row
                  align="center"
                  class="white--text mx-auto"
                  justify="center"
                >
                  <v-col class="primary--text text-center" cols="12" tag="h1">
                    <span
                      :class="[
                        $vuetify.breakpoint.smAndDown
                          ? 'display-1'
                          : 'display-2',
                      ]"
                      class="font-weight-light"
                    >
                      LABORATORIO INMUNOLÓGICO DEL SUR
                    </span>

                    <br />

                    <span
                      :class="[
                        $vuetify.breakpoint.smAndDown
                          ? 'display-3'
                          : 'display-4',
                      ]"
                      class="font-weight-black"
                    >
                      LABISUR
                    </span>

                    <br />
                    <span
                      :class="[
                        $vuetify.breakpoint.smAndDown ? 'headline' : 'title',
                      ]"
                      class="font-weight-bold secondary--text"
                    >
                      Nos apasiona contribuir con nuestra ciencia a la salud de
                      las personas
                    </span>
                  </v-col>

                  <v-btn
                    color="secondary"
                    class="align-self-end"
                    fab
                    outlined
                    @click="$vuetify.goTo('#about-me')"
                  >
                    <v-icon color="secondary">mdi-chevron-double-down</v-icon>
                  </v-btn>
                </v-row>
              </v-container>
            </v-theme-provider>
          </v-card>
        </v-row>
      </section>

      <section id="about-me" class="grey lighten-4">
        <div class="py-12"></div>

        <v-container class="text-center">
          <h2 class="display-2 font-weight-bold mb-3">ACERCA DE LABISUR</h2>

          <v-responsive class="mx-auto mb-8" width="56">
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>
          <v-avatar class="elevation-12 mb-12 white" size="200">
            <v-img contain :src="logoLabisur" />
          </v-avatar>

          <v-responsive
            class="mx-auto title font-weight-light mb-8"
            max-width="720"
          >
            LABISUR ha prestado servicios de diagnóstico y asesoría a Doctores,
            Especialistas y Pacientes durante más de una década. La innovación y
            el desarrollo ha sido un aporte a la Medicina nacional que ha sido
            reconocida por importantes referentes. Conozca nuestro servicio.
            Contamos con una amplia variedad de exámenes, respaldados por el
            conocimiento y la tecnología que nos han llevado a ser la mejor
            opción en el apoyo de Diagnóstico y Tratamiento.<br /><br />
            Para ofrecer la mejor calidad a nuestros usuarios contamos con las
            últmas tecnologías de diagnóstico en todas nuestras áreas.<br />
            Nuestros profesionales están en constante capacitación.
            <br />Exigimos a nuestros proveedores un trato preferencial en la
            calidad de insumos, dada nuestro nivel de referente en el
            diagnóstico clínico en el país. Hemos implementado sistemas
            asesguramiento de la calidad de acuerdo a la norma ISO 15189 y
            gestión de calidad ISO 9000:2000. Todo para dar a nuestros usuarios
            Clínicos y Pacientes la mayor de las confianzas y brindarles un
            apoyo diagnóstico eficiente y eficaz.
          </v-responsive>

          <div></div>
        </v-container>

        <div class="py-12"></div>
      </section>

      <section id="features" class="grey lighten-2">
        <div class="py-12"></div>

        <v-container class="text-center">
          <h2 class="display-2 font-weight-bold mb-3">PRESTACIONES</h2>

          <v-responsive class="mx-auto mb-12" width="56">
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>

          <v-row>
            <v-col
              v-for="({ icon, title, text }, i) in features"
              :key="i"
              cols="12"
              md="4"
            >
              <v-card class="py-12 px-4" color="grey lighten-5" flat>
                <v-theme-provider dark>
                  <div>
                    <v-avatar color="primary" size="88">
                      <v-icon large v-text="icon"></v-icon>
                    </v-avatar>
                  </div>
                </v-theme-provider>

                <v-card-title
                  class="justify-center font-weight-black text-uppercase"
                  v-html="title"
                ></v-card-title>

                <v-card-text class="subtitle-1" v-html="text"> </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <div class="my-14"></div>

          <v-btn
            :to="{ name: 'Observations' }"
            class="white"
            color="white"
            outlined
            x-large
          >
            <span
              class="
                primary--text
                text--darken-2
                font-weight-black
                text-uppercase
              "
            >
              Ir a cartera completa de prestaciones
            </span>
          </v-btn>
        </v-container>

        <div class="py-12"></div>
      </section>

      <section id="stats">
        <v-parallax
          :height="$vuetify.breakpoint.smAndDown ? 700 : 500"
          :src="laboratoryImg"
        >
          <v-container fill-height>
            <v-row class="mx-auto">
              <v-col
                v-for="[value, title] of stats"
                :key="title"
                cols="12"
                md="6"
              >
                <div class="text-center">
                  <div
                    class="display-3 primary font-weight-black mb-4"
                    v-text="value"
                  ></div>

                  <div
                    class="title primary font-weight-regular text-uppercase"
                    v-text="title"
                  ></div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-parallax>
      </section>

      <section id="blog">
        <div class="py-12"></div>

        <v-container>
          <h2
            class="display-2 font-weight-bold mb-3 text-uppercase text-center"
          >
            NUESTROS FUNCIONARIOS
          </h2>

          <v-responsive class="mx-auto mb-12" width="56">
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>

          <v-row>
            <v-col
              v-for="({ src, text, title }, i) in articles"
              :key="i"
              cols="12"
              md="4"
            >
              <v-img
                :src="src"
                class="mb-4"
                height="275"
                max-width="100%"
              ></v-img>

              <h3
                class="font-weight-black mb-4 text-uppercase"
                v-text="title"
              ></h3>

              <div class="title font-weight-light mb-5" v-text="text"></div>
            </v-col>
          </v-row>
        </v-container>

        <div class="py-12"></div>
      </section>

      <v-sheet id="contact" color="secondary lighten-1" dark tag="section" tile>
        <div class="py-12"></div>

        <v-container>
          <h2
            class="display-2 font-weight-bold mb-3 text-uppercase text-center"
          >
            CONTACTO
          </h2>

          <v-responsive class="mx-auto mb-12" width="56">
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>

          <v-theme-provider light>
            <v-row>
              <v-col cols="12">
                <v-text-field flat label="Nombre*" solo></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field flat label="Email*" solo></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field flat label="Asunto*" solo></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea flat label="Mensaje*" solo></v-textarea>
              </v-col>

              <v-col class="mx-auto" cols="auto">
                <v-btn color="primary" x-large> Enviar </v-btn>
              </v-col>
            </v-row>
          </v-theme-provider>
        </v-container>

        <div class="py-12"></div>
      </v-sheet>
    </v-main>

    <v-footer class="justify-center" color="secondary darken-2" height="100">
      <div
        class="title font-weight-light grey--text text--lighten-1 text-center"
      >
        &copy; {{ new Date().getFullYear() }} -
        <span class="font-weight-bold text-h5">e-Labnote</span>
      </div>
    </v-footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logoLabisur from "../../assets/logo_labisur.jpg";
import laboratoryImg from "../../assets/50523-laboratorio-clinico.jpg";

import chiefLabImg from "../../assets/jaime-inostroza-650.jpg";
export default {
  name: "Index",

  data() {
    return {
      logoLabisur,
      laboratoryImg,
      chiefLabImg,
      articles: [
        {
          src: chiefLabImg,
          title: "Una vida dedidado a la medicina de diagnóstico",
          text: "Referente nacional en el área de la medicina preventiva, inmunizaciones y vacunas, siendo actualmente integrante del Comité Asesor en Vacunas y Estrategias de Inmunización (CAVEI).",
        },
        {
          src: "https://images.unsplash.com/photo-1475938476802-32a7e851dad1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
          title: "Think outside the box",
          text: "Nam ut leo ipsum. Maecenas pretium aliquam feugiat. Aenean vel tempor est, vitae tincidunt risus. Sed sodales vestibulum nibh.",
        },
        {
          src: "https://images.unsplash.com/photo-1416339442236-8ceb164046f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1892&q=80",
          title: "Small changes, big difference",
          text: "Vestibulum in dictum velit, in rhoncus nibh. Maecenas neque libero, interdum a dignissim in, aliquet vitae lectus. Phasellus lorem enim, luctus ut velit eget.",
        },
      ],
      features: [
        {
          icon: "mdi-account-group-outline",
          title: "Diagnostico Molecular",
          text: "<ul style='list-style: none'><li>Herpes 1</li> <li>Herpes 2</li> <li>Epstein Barr virus</li><li>Carga Viral VIH</li><li>Panel viral respiratorio (16 virus resp.)</li><li>PPD cutáneo</li></ul>",
        },
        {
          icon: "mdi-update",
          title: "Poblaciones linfocitarias",
          text: "<ul style='list-style: none'><li>CD3, CD4, CD8</li> <li>CD19(linfocitos B)</li> <li>Natural Killer (CD16+56)</li><li>Linfocitos B memory (CD27)</li><li>Otro</li><li>Otro</li></ul>",
        },
        {
          icon: "mdi-shield-outline",
          title: "Anticuerpos y Marcadores",
          text: "<ul style='list-style: none'><li>Anticuerpos Anti-Nucleares</li> <li>Anticuerpos Anti-DNA</li> <li>Anticuerpos Anti-ENA</li><li>Factor Reumatoídeo</li><li>Proteína C reactiva</li><li>Inmunoglobulinas A,G,M</li></ul>",
        },
      ],
      stats: [["ASEGURAMIENTO DE CALIDAD", "Normas 15189/ISO 9000:2000"]],
    };
  },

  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
    }),
  },
};
</script>

<style scoped></style>

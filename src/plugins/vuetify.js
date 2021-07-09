import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify, { VSkeletonLoader } from "vuetify/lib";
import { es, en } from "vuetify/es5/locale";
import { Ripple, Scroll } from "vuetify/lib/directives";

Vue.use(Vuetify, {
  components: {
    VSkeletonLoader,
  },
  directives: {
    Ripple,
    Scroll,
  },
});

const options = {
  lang: {
    locales: { es, en },
    current: "es",
  },
  theme: {
    themes: {
      light: {
        primary: "#3999BF", //'#027087'
        secondary: "#737373",
        terciary: "#8BC3D9",
        red: "#AC1315", //'#AC1315' '#BA2E38'
        white: "#F2F2F2",
        black: "#262223",
      },
    },
  },
};

export default new Vuetify(options);

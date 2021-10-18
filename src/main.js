import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./services/subscriber";
import "./plugins/base";
//import "./services/pusher.config";

Vue.config.productionTip = false;

const token = localStorage.getItem("access_token");

if (token) {
  store.dispatch("auth/attempt", token);
}

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

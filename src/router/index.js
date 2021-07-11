import Vue from "vue";
import VueRouter from "vue-router";
import { settings } from "./settings";
import { advancedSettings } from "./advancedSettings";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/login/Index.vue"),
  },
  {
    path: "/modulos",
    name: "Modules",
    component: () =>
      import(/* webpackChunkName: "modules" */ "../views/modules/Index.vue"),
  },
  {
    path: "/modulos/solicitud-de-medios",
    name: "laboratoryRequests",
    component: () =>
      import(
        /* webpackChunkName: "laboratoryRequest" */ "../views/laboratoryRequest/Index.vue"
      ),
  },
  {
    path: "/modulos/toma-de-muestras",
    name: "sampling",
    component: () =>
      import(
        /* webpackChunkName: "laboratoryRequest" */ "../views/laboratoryRequest/Index.vue"
      ),
  },
  {
    path: "/modulos/configuracion",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/settings/Index.vue"),
    children: [...settings],
  },
  {
    path: "/modulos/configuracion-avanzada",
    name: "advancedSettings",
    component: () =>
      import(
        /* webpackChunkName: "advancedSettings" */ "../views/advancedSettings/Index.vue"
      ),
    children: [...advancedSettings],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

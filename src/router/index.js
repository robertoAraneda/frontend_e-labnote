import Vue from "vue";
import VueRouter from "vue-router";
import { settings } from "./settings";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/pages/login/Index.vue"),
  },
  {
    path: "/modulos",
    name: "Modules",
    component: () =>
      import(
        /* webpackChunkName: "modules" */ "../views/pages/modules/Index.vue"
      ),
  },
  {
    path: "/modulos/configuracion",
    name: "settings",
    component: () =>
      import(
        /* webpackChunkName: "settings" */ "../views/pages/settings/Index.vue"
      ),
    children: [...settings],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

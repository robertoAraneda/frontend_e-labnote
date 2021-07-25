import Vue from "vue";
import VueRouter from "vue-router";
import { settings } from "./settings";
import { advancedSettings } from "./advancedSettings";

import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Index.vue"),
    children: [
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
          import(
            /* webpackChunkName: "modules" */ "../views/modules/Index.vue"
          ),
        meta: { requiresAuth: true },
      },
      {
        path: "/modulos/solicitud-de-medios",
        name: "laboratoryRequests",
        component: () =>
          import(
            /* webpackChunkName: "laboratoryRequest" */ "../views/laboratoryRequest/Index.vue"
          ),
        meta: { requiresAuth: true },
      },
      {
        path: "/modulos/toma-de-muestras",
        name: "sampling",
        component: () =>
          import(
            /* webpackChunkName: "laboratoryRequest" */ "../views/laboratoryRequest/Index.vue"
          ),
        meta: { requiresAuth: true },
      },
      {
        path: "/modulos/configuracion",
        component: () =>
          import(
            /* webpackChunkName: "settings" */ "../views/settings/Index.vue"
          ),
        meta: { requiresAuth: true },
        children: [...settings],
      },
      {
        path: "/modulos/configuracion-avanzada",
        component: () =>
          import(
            /* webpackChunkName: "advancedSettings" */ "../views/advancedSettings/Index.vue"
          ),
        meta: { requiresAuth: true },
        children: [...advancedSettings],
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
});

router.beforeEach((to, from, next) => {
  store.dispatch("auth/attempt");
  const loggedIn = localStorage.getItem("access_token");

  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    console.log(to);
    next("/");
  }
  next();
});

export default router;

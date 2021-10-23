import Vue from "vue";
import VueRouter from "vue-router";
import { settings } from "./settings";
import { advancedSettings } from "./advancedSettings";
import { serviceRequest } from "./serviceRequest";
import { appointment } from "./appointment";
import { samplings } from "./samplings";

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
        component: () =>
          import(
            /* webpackChunkName: "serviceRequest" */ "../views/serviceRequest/Index.vue"
          ),
        meta: { requiresAuth: true },
        children: [...serviceRequest],
      },
      {
        path: "/modulos/toma-de-muestras",
        component: () =>
          import(
            /* webpackChunkName: "sampling" */ "../views/sampling/Index.vue"
          ),
        meta: { requiresAuth: true },
        children: [...samplings],
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
      {
        path: "/modulos/agenda",
        component: () =>
          import(
            /* webpackChunkName: "appointment" */ "../views/appointments/Index.vue"
          ),
        meta: { requiresAuth: true },
        children: [...appointment],
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
  const loggedIn = localStorage.getItem("access_token");

  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    console.log(to);
    next("/");
  }
  next();
});

export default router;
